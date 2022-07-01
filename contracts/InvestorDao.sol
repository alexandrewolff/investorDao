// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./interfaces/IIDAO.sol";

import "hardhat/console.sol";

contract InvestorDao {
    using SafeMath for uint256;

    address public immutable idao;
    address public immutable dai;
    address public immutable uniswapRouter;

    uint32 public immutable contributionEnd; // changed from 24 to 32
    uint24 public immutable voteTime;
    // uint256 public immutable gracePeriod;
    // uint256 public immutable proposalValidity;
    uint8 public immutable quorum;

    Proposal[] public proposals;

    enum ProposalType {
        BUY,
        SELL
    }

    enum Vote {
        YES,
        NO
    }

    struct Proposal {
        ProposalType proposalType;
        address token;
        uint256 amountIn;
        uint40 voteEnd;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voted;
    }

    event LiquidityInvested(address user, uint256 daiAmount);
    event LiquidityWithdrew(
        address user,
        uint256 idaoAmount,
        uint256 weiAmount
    );
    event ProposalCreated(
        uint256 id,
        address proposer,
        ProposalType proposalType,
        address token,
        uint256 amountIn
    );
    event InvestorVoted(
        uint256 proposalId,
        address voter,
        Vote answer,
        uint256 investorWeight
    );
    event ProposalExecution(
        uint256 proposalId,
        bool validated,
        ProposalType proposalType,
        address tokenBought,
        uint256 amountInvested,
        uint256 amountReceived
    );

    constructor(
        uint24 contributionTime,
        uint24 _voteTime,
        uint8 _quorum,
        address _idaoToken,
        address _daiToken,
        address _uniswapRouter
    ) public {
        require(_idaoToken != address(0), "zero address detected");
        require(_daiToken != address(0), "zero address detected");
        require(_uniswapRouter != address(0), "zero address detected");

        contributionEnd = uint32(block.timestamp.add(contributionTime));
        voteTime = _voteTime;
        quorum = _quorum;
        idao = _idaoToken;
        dai = _daiToken;
        uniswapRouter = _uniswapRouter;
    }

    function getProposalsAmount() external view returns (uint256) {
        return proposals.length;
    }

    function invest(uint256 amount) external {
        require(
            block.timestamp < contributionEnd,
            "InvestorDao: cannot contribute after contributionEnd"
        );

        IERC20(dai).transferFrom(msg.sender, address(this), amount);
        IIDAO(idao).mint(msg.sender, amount); // 1 DAI invested = 1 IDAO received

        emit LiquidityInvested(msg.sender, amount);
    }

    function withdraw(uint256 idaoAmount) external {
        IIDAO _idao = IIDAO(idao);

        // Computes the ratio of available funds the user is entitled to
        uint256 daiOut = IERC20(dai)
            .balanceOf(address(this))
            .mul(idaoAmount)
            .div(_idao.totalSupply());

        _idao.burn(msg.sender, idaoAmount);
        IERC20(dai).transfer(msg.sender, daiOut);

        emit LiquidityWithdrew(msg.sender, idaoAmount, daiOut);
    }

    function createProposal(
        ProposalType proposalType,
        address token,
        uint256 amountIn
    ) external {
        require(
            IIDAO(idao).balanceOf(msg.sender) > 0,
            "InvestorDao: access restricted to investors"
        );
        require(token != address(0), "InvestorDao: zero address provided");
        proposals.push(
            Proposal(
                proposalType,
                token,
                amountIn,
                uint40(block.timestamp.add(voteTime)),
                0,
                0
            )
        );
        emit ProposalCreated(
            // Cannot underflow since a proposition will always be pushed before
            proposals.length - 1,
            msg.sender,
            proposalType,
            token,
            amountIn
        );
    }

    function vote(uint256 proposalId, Vote answer) external {
        require(
            proposalId < proposals.length,
            "InvestorDao: proposal does not exist"
        );
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.voted[msg.sender] == false,
            "InvestorDao: investor already voted"
        );
        require(
            block.timestamp < proposal.voteEnd,
            "InvestorDao: vote period ended"
        );

        proposal.voted[msg.sender] = true;

        uint256 investorWeight = IIDAO(idao).balanceOf(msg.sender);
        if (Vote.YES == answer)
            proposal.yesVotes = proposal.yesVotes.add(investorWeight);
        else proposal.noVotes = proposal.noVotes.add(investorWeight);

        emit InvestorVoted(proposalId, msg.sender, answer, investorWeight);
    }

    // function executeProposal(uint256 proposalId) external onlyInvestors {
    //     Proposal storage proposal = proposals[proposalId];
    //     uint256 idaoTotalSupply = IIDAO(idao).totalSupply();
    //     uint256 votesRate = proposal.votes.mul(100).div(idaoTotalSupply);

    //     require(
    //         block.timestamp >= proposal.end,
    //         "cannot execute proposal before end date"
    //     );
    //     require(
    //         proposal.executed == false,
    //         "cannot execute proposal already executed"
    //     );

    //     proposal.executed = true;

    //     if (votesRate >= quorum) {
    //         if (proposal.proposalType == ProposalType.BUY) {
    //             uint256[] memory amountsOut = trade(
    //                 proposal.amountIn,
    //                 dai,
    //                 proposal.token
    //             );

    //             emit ProposalExecution(
    //                 proposal.id,
    //                 true,
    //                 proposal.proposalType,
    //                 proposal.token,
    //                 proposal.amountIn,
    //                 amountsOut[1]
    //             );
    //         } else if (proposal.proposalType == ProposalType.SELL) {
    //             uint256[] memory amountsOut = trade(
    //                 proposal.amountIn,
    //                 proposal.token,
    //                 dai
    //             );

    //             availableFunds = availableFunds.add(amountsOut[1]);

    //             emit ProposalExecution(
    //                 proposal.id,
    //                 true,
    //                 proposal.proposalType,
    //                 proposal.token,
    //                 proposal.amountIn,
    //                 amountsOut[1]
    //             );
    //         }
    //     } else {
    //         availableFunds = availableFunds.add(proposal.amountIn);

    //         emit ProposalExecution(
    //             proposal.id,
    //             false,
    //             proposal.proposalType,
    //             proposal.token,
    //             proposal.amountIn,
    //             0
    //         );
    //     }
    // }

    function trade(
        uint256 amountIn,
        address token0,
        address token1
    ) private returns (uint256[] memory) {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;

        IERC20(token0).approve(uniswapRouter, amountIn);

        IUniswapV2Router02 uniswap = IUniswapV2Router02(uniswapRouter);
        uint256[] memory maxAmounts = IUniswapV2Router02(uniswapRouter)
            .getAmountsOut(amountIn, path);
        return
            uniswap.swapExactTokensForTokens(
                amountIn,
                maxAmounts[path.length - 1],
                path,
                address(this),
                block.timestamp + 12
            );
    }
}
