pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import './interfaces/IUniswapV2Router02.sol';

contract InvestorDao {
    using SafeMath for uint256;
    
    address uniswapV2Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    uint256 public totalShares;
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

    mapping(address => uint256) public shares;

    event LiquidityInvested(address user, uint256 weiAmount);
    event LiquidityDivested(address user, uint256 shareAmount, uint256 weiAmount);
    event SharesTransfered(address from, address to, uint256 weiAmount);
    event ProposalCreated(address user, uint256 id, string token, uint256 amountToTrade, uint256 end);

    modifier onlyInvestors() {
        require(shares[msg.sender] > 0, 'only investors');
        _;
    }

    constructor(uint256 contributionTime, uint256 _voteTime) public {
        contributionEnd = block.timestamp + contributionTime;
        voteTime = _voteTime;
    }

    function getProposalsAmount() external view returns(uint256) {
        return proposals.length;
    }

    function invest() payable external {
        require(block.timestamp < contributionEnd, 'cannot contribute after contributionEnd');

        shares[msg.sender] = shares[msg.sender].add(msg.value); // 1 wei = 1 share
        totalShares = totalShares.add(msg.value);
        availableFunds = availableFunds.add(msg.value);

        emit LiquidityInvested(msg.sender, msg.value);
    }

    function divest(uint256 shareAmount) external {
        require(shares[msg.sender] >= shareAmount, 'not enough shares');

        shares[msg.sender] = shares[msg.sender].sub(shareAmount);
        uint256 weiOut = availableFunds.mul(shareAmount).div(totalShares);
        availableFunds = availableFunds.sub(weiOut);

        emit LiquidityDivested(msg.sender, shareAmount, weiOut);

        msg.sender.transfer(weiOut);
    }
    
    function transferShares(uint256 shareAmount, address to) external {
        require(shares[msg.sender] >= shareAmount, 'not enough shares');

        shares[msg.sender] = shares[msg.sender].sub(shareAmount);
        shares[to] = shares[to].add(shareAmount);

        emit SharesTransfered(msg.sender, to, shareAmount);
    }

    function createProposal(ProposalType proposalType, string memory token, uint256 amountToTrade) public onlyInvestors() {
        require(availableFunds >= amountToTrade, 'not enough available funds');
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
}