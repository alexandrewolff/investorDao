// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./FakeUniswapPair.sol";
import "./TestToken.sol";

contract FakeUniswapRouter {
    using SafeMath for uint256;

    // token0Addr => token1Addr => pairAddr
    mapping(address => mapping(address => address)) public tokensToPair;

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    function launchPair(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) public {
        FakeUniswapPair newPair = new FakeUniswapPair(
            tokenA,
            tokenB,
            amountA,
            amountB
        );
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        tokensToPair[token0][token1] = address(newPair);
    }

    function getPairAddr(address tokenA, address tokenB)
        public
        view
        returns (address)
    {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        return tokensToPair[token0][token1];
    }

    function sortTokens(address tokenA, address tokenB)
        public
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "UniswapV2Library: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "UniswapV2Library: ZERO_ADDRESS");
    }

    function getReserves(
        address pairAddr,
        address tokenA,
        address tokenB
    ) public view returns (uint256 reserveA, uint256 reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint256 reserve0, uint256 reserve1, ) = FakeUniswapPair(pairAddr)
            .getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function getAmountsOut(uint256 amountIn, address[] memory path)
        public
        view
        returns (uint256[] memory amounts)
    {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        (address token0, address token1) = sortTokens(path[0], path[1]);
        address pairAddr = tokensToPair[token0][token1];
        (uint256 reserveIn, uint256 reserveOut) = getReserves(
            pairAddr,
            path[0],
            path[1]
        );
        amounts[1] = getAmountOut(amounts[0], reserveIn, reserveOut);
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        amounts = getAmountsOut(amountIn, path);
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        (address token0, address token1) = sortTokens(path[0], path[1]);
        address pair0Addr = tokensToPair[token0][token1];
        TestToken(path[0]).transferFrom(to, pair0Addr, amounts[0]);
        FakeUniswapPair(pair0Addr).increaseReserve(path[0], amounts[0]);
        FakeUniswapPair(pair0Addr).send(path[1], to, amounts[1]);
    }
}
