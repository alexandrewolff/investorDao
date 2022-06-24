// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapUtilities {
    address uniswapV2Router02;

    constructor(address _uniswapV2Router02) public {
        uniswapV2Router02 = _uniswapV2Router02;
    }

    function _tradeToken(
        uint256 amountIn,
        address token0,
        address token1
    ) internal returns (uint256[] memory) {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;

        IERC20(token0).approve(uniswapV2Router02, amountIn);

        IUniswapV2Router02 uniswap = IUniswapV2Router02(uniswapV2Router02);

        uint256[] memory maxAmounts = uniswap.getAmountsOut(amountIn, path);

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
