// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./TestToken.sol";

contract FakeUniswapPair {
    address public token0;
    address public token1;

    uint112 public reserve0;
    uint112 public reserve1;
    uint32 public blockTimestampLast = 0;

    constructor(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) public {
        (token0, token1) = sortTokens(tokenA, tokenB);
        getTokens(tokenA, amountA);
        getTokens(tokenB, amountB);
    }

    function getTokens(address token, uint256 amount) private {
        require(
            token == token0 || token == token1,
            "can only get tokens for tokens of this pool"
        );
        TestToken(token).mint(address(this), amount);
        token == token0 ? reserve0 += uint112(amount) : reserve1 += uint112(
            amount
        );
    }

    function sortTokens(address tokenA, address tokenB)
        internal
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "UniswapV2Library: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "UniswapV2Library: ZERO_ADDRESS");
    }

    function getReserves()
        public
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        )
    {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function increaseReserve(address token, uint256 amount) public {
        require(
            token == token0 || token == token1,
            "can only update reserve for tokens of this pool"
        );
        if (token == token0) {
            reserve0 += uint112(amount);
        } else {
            reserve1 += uint112(amount);
        }
    }

    function decreaseReserve(address token, uint256 amount) public {
        require(
            token == token0 || token == token1,
            "can only update reserve for tokens of this pool"
        );
        if (token == token0) {
            reserve0 -= uint112(amount);
        } else {
            reserve1 -= uint112(amount);
        }
    }

    function send(
        address token,
        address to,
        uint256 amount
    ) external {
        TestToken(token).transfer(to, amount);
        decreaseReserve(token, amount);
    }
}
