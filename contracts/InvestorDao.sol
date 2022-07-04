// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./interfaces/IIDAO.sol";

import "hardhat/console.sol";

contract InvestorDao {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public immutable idao;
    address public immutable dai;
    address public immutable weth;
    address public immutable uniswapRouter;

    uint32 public immutable contributionEnd; // changed from 24 to 32
    uint24 public immutable voteTime;
    uint256 public immutable proposalValidity;
    uint256 private immutable sendEthToExecutorMaxGas;

    Proposal[] public proposals;

    enum Vote {
        YES,
        NO
    }

    struct Proposal {
        address[] path;
        uint256 amountIn;
        uint40 voteEnd;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voted;
    }

    event LiquidityInvested(address indexed user, uint256 daiAmount);
    event LiquidityWithdrew(
        address indexed user,
        uint256 idaoAmount,
        uint256 weiAmount
    );
    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        address[] path,
        uint256 amountIn
    );
    event InvestorVoted(
        uint256 indexed id,
        address indexed voter,
        Vote answer,
        uint256 investorWeight
    );
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyInvestors() {
        require(
            IIDAO(idao).balanceOf(msg.sender) > 0,
            "InvestorDao: access restrictedd to investors"
        );
        _;
    }

    constructor(
        uint24 contributionTime,
        uint24 _voteTime,
        uint256 _proposalValidity,
        address _idao,
        address _dai,
        address _weth,
        address _uniswapRouter,
        uint256 _sendEthToExecutorMaxPrice
    ) public {
        require(_idao != address(0), "zero address detected");
        require(_dai != address(0), "zero address detected");
        require(_uniswapRouter != address(0), "zero address detected");

        contributionEnd = uint32(block.timestamp.add(contributionTime));
        voteTime = _voteTime;
        proposalValidity = _proposalValidity;
        idao = _idao;
        dai = _dai;
        weth = _weth;
        uniswapRouter = _uniswapRouter;
        sendEthToExecutorMaxGas = _sendEthToExecutorMaxPrice;
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

    function createProposal(address[] memory path, uint256 amountIn) external {
        require(
            IIDAO(idao).balanceOf(msg.sender) > 0,
            "InvestorDao: access restricted to investors"
        );
        proposals.push(
            Proposal(
                path,
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
            path,
            amountIn
        );
    }

    function voteProposal(uint256 id, Vote answer) external {
        require(id < proposals.length, "InvestorDao: proposal does not exist");
        Proposal storage proposal = proposals[id];
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

        emit InvestorVoted(id, msg.sender, answer, investorWeight);
    }

    function executeProposal(uint256 id) external {
        uint256 startGas = gasleft();

        require(id < proposals.length, "InvestorDao: proposal does not exist");

        Proposal storage proposal = proposals[id];
        require(
            block.timestamp > proposal.voteEnd,
            "InvestorDao: cannot execute proposal before end of vote"
        );
        require(
            block.timestamp < proposal.voteEnd + proposalValidity,
            "InvestorDao: proposal expired"
        );
        require(
            proposal.yesVotes > proposal.noVotes,
            "InvestorDao: proposal refused"
        );

        trade(proposal.path, proposal.amountIn);

        delete proposals[id];
        emit ProposalExecuted(id);

        IERC20(dai).safeTransfer(msg.sender, 100 ether);

        uint256 endGas = gasleft();

        sendEthToExecutor(
            (startGas.sub(endGas).add(sendEthToExecutorMaxGas)).mul(tx.gasprice)
        );
    }

    function trade(address[] memory path, uint256 amountIn)
        private
        returns (uint256[] memory)
    {
        IERC20(path[0]).approve(uniswapRouter, amountIn);

        IUniswapV2Router02 uniswap = IUniswapV2Router02(uniswapRouter);
        uint256[] memory maxAmounts = IUniswapV2Router02(uniswapRouter)
            .getAmountsOut(amountIn, path);

        uniswap.swapExactTokensForTokens(
            amountIn,
            maxAmounts[path.length - 1],
            path,
            address(this),
            block.timestamp + 12
        );
    }

    function sendEthToExecutor(uint256 amount) private {
        address[] memory path = new address[](2);
        path[0] = dai;
        path[1] = weth;

        IUniswapV2Router02 uniswap = IUniswapV2Router02(uniswapRouter);
        uint256[] memory amountInMax = uniswap.getAmountsIn(amount, path);
        IERC20(dai).approve(uniswapRouter, amountInMax[0]);

        uniswap.swapTokensForExactETH(
            amount,
            amountInMax[0],
            path,
            msg.sender,
            block.timestamp + 12
        );
    }
}
