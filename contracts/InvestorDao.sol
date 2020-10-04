pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./UniswapUtilities.sol";
import "./interfaces/IIDAO.sol";

contract InvestorDao is UniswapUtilities {
    using SafeMath for uint256;
    
    address idaoToken;
    address daiToken;

    uint256 public availableFunds;
    uint256 public contributionEnd;
    uint256 public voteTime;
    uint256 public quorum;
    Proposal[] public proposals;
    
    enum ProposalType { buy, sell }

    struct Proposal {
        uint256 id;
        ProposalType proposalType;
        address token;
        uint256 amountToTrade;
        uint256 votes;
        uint256 end;
        bool executed;
    }

    mapping(address => mapping(uint256 => bool)) public voted;

    event LiquidityInvested(address user, uint256 daiAmount);
    event LiquidityDivested(address user, uint256 idaoAmount, uint256 weiAmount);
    event ProposalCreated(address user, uint256 id, address token, uint256 amountToTrade, uint256 end);
    event InvestorVoted(address user, uint256 investorWeight, uint256 proposalId);
    event ProposalExecuted(uint256 proposalId, ProposalType proposalType, address tokenBought, uint256 amountInvested, uint256 amountReceived);

    modifier onlyInvestors() {
        require(IIDAO(idaoToken).balanceOf(msg.sender) > 0, "only investors");
        _;
    }

    constructor(uint256 contributionTime,
        uint256 _voteTime,
        uint256 _quorum,
        address _idaoToken,
        address _daiToken,
        address uniswapV2Router02
    ) UniswapUtilities(uniswapV2Router02)
    public {
        require(_idaoToken != address(0), "zero address detected");
        require(_daiToken != address(0), "zero address detected");
        require(uniswapV2Router02 != address(0), "zero address detected");

        contributionEnd = block.timestamp + contributionTime;
        voteTime = _voteTime;
        quorum = _quorum;
        idaoToken = _idaoToken;
        daiToken = _daiToken;
    }

    function invest(uint256 amount) external {
        require(block.timestamp < contributionEnd, "cannot contribute after contributionEnd");

        availableFunds = availableFunds.add(amount);

        emit LiquidityInvested(msg.sender, amount);

        IERC20(daiToken).transferFrom(msg.sender, address(this), amount);
        IIDAO(idaoToken).mint(msg.sender, amount); // 1 DAI invested = 1 IDAO received
    }

    function divest(uint256 idaoAmount) external {
        IIDAO idao = IIDAO(idaoToken);

        require(idao.balanceOf(msg.sender) >= idaoAmount, "not enough IDAO");

        uint256 daiOut = availableFunds.mul(idaoAmount).div(idao.totalSupply());
        availableFunds = availableFunds.sub(daiOut);

        emit LiquidityDivested(msg.sender, idaoAmount, daiOut);

        idao.burn(msg.sender, idaoAmount);
        IERC20(daiToken).transfer(msg.sender, daiOut);
    }

    function createProposal(ProposalType proposalType, address token, uint256 amountToTrade) public onlyInvestors {
        require(availableFunds >= amountToTrade, "not enough available funds");
        require(token != address(0), "zero address detected");

        if (proposalType == ProposalType.sell) {
            uint256 tokensOwned = IERC20(token).balanceOf(address(this));
            require(amountToTrade <= tokensOwned, "not enough tokens to sell");
        }

        uint256 nextId = proposals.length;
        uint256 end = block.timestamp + voteTime;

        proposals.push(Proposal(
            nextId,
            proposalType,
            token,
            amountToTrade,
            0,
            end,
            false
        ));

        availableFunds = availableFunds.sub(amountToTrade);

        emit ProposalCreated(msg.sender, nextId, token, amountToTrade, end);
    }

    function getProposalsAmount() external view returns(uint256) {
        return proposals.length;
    }

    function vote(uint256 proposalId) external onlyInvestors {
        Proposal storage proposal = proposals[proposalId];
        uint256 investorWeight = IIDAO(idaoToken).balanceOf(msg.sender);

        require(voted[msg.sender][proposalId] == false, "investor can only vote once for a proposal");
        require(block.timestamp < proposal.end, "can only vote until proposal end date");

        voted[msg.sender][proposalId] = true;
        proposal.votes = proposal.votes.add(investorWeight); // votes are weighted

        emit InvestorVoted(msg.sender, investorWeight, proposalId);
    }

    function executeProposal(uint256 proposalId) external onlyInvestors {
        Proposal storage proposal = proposals[proposalId];
        uint256 idaoTotalSupply = IIDAO(idaoToken).totalSupply();
        uint256 votesRate = proposal.votes.mul(100).div(idaoTotalSupply);

        require(block.timestamp >= proposal.end, "cannot execute proposal before end date");
        require(proposal.executed == false, "cannot execute proposal already executed");

        proposal.executed = true;

        if (votesRate >= quorum) {
            if (proposal.proposalType == ProposalType.buy) {
                address[] memory path = new address[](2);
                path[0] = daiToken;
                path[1] = proposal.token;

                uint256[] memory amountsOut = _tradeToken(proposal.amountToTrade, path);

                emit ProposalExecuted(proposal.id,
                    proposal.proposalType,
                    proposal.token,
                    proposal.amountToTrade,
                    amountsOut[1]
                );
            } else if (proposal.proposalType == ProposalType.sell) {
                address[] memory path = new address[](2);
                path[0] = proposal.token;
                path[1] = daiToken;

                uint256[] memory amountsOut = _tradeToken(proposal.amountToTrade, path);

                availableFunds = availableFunds.add(amountsOut[1]);

                emit ProposalExecuted(proposal.id,
                    proposal.proposalType,
                    proposal.token,
                    proposal.amountToTrade,
                    amountsOut[1]
                );
            }
        } else availableFunds = availableFunds.add(proposal.amountToTrade);
    }
}