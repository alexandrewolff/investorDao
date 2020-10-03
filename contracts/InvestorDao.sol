pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IIDAO.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract InvestorDao {
    using SafeMath for uint256;
    
    address idaoToken;
    address daiToken;
    address uniswapV2Router02;

    uint256 public availableFunds;
    uint256 public contributionEnd;
    uint256 public voteTime;
    Proposal[] public proposals;
    
    enum ProposalType { buy, sell }

    struct Proposal {
        uint256 id;
        ProposalType proposalType;
        string token;
        uint256 amountToTrade;
        uint256 votes;
        uint256 end;
        bool executed;
    }

    mapping(address => mapping(uint256 => bool)) voted;

    event LiquidityInvested(address user, uint256 daiAmount);
    event LiquidityDivested(address user, uint256 idaoAmount, uint256 weiAmount);
    event ProposalCreated(address user, uint256 id, string token, uint256 amountToTrade, uint256 end);
    event InvestorVoted(address user, uint256 investorWeight, uint256 proposalId);

    modifier onlyInvestors() {
        require(IIDAO(idaoToken).balanceOf(msg.sender) > 0, "only investors");
        _;
    }

    constructor(uint256 contributionTime, uint256 _voteTime, address _idaoToken, address _daiToken, address _uniswapV2Router02) public {
        require(_idaoToken != address(0), "zero address detected");
        require(_daiToken != address(0), "zero address detected");
        require(_uniswapV2Router02 != address(0), "zero address detected");

        contributionEnd = block.timestamp + contributionTime;
        voteTime = _voteTime;
        idaoToken = _idaoToken;
        daiToken = _daiToken;
        uniswapV2Router02 = _uniswapV2Router02;
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

    function createProposal(ProposalType proposalType, string memory token, uint256 amountToTrade) public onlyInvestors {
        require(availableFunds >= amountToTrade, "not enough available funds");
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
}