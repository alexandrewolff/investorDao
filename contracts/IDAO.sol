// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IIDAO} from "./interfaces/IIDAO.sol";

contract IDAO is ERC20, Ownable, IIDAO {
    constructor() public ERC20("IDAO", "IDAO") {}

    function mint(address to, uint256 amount) external override onlyOwner {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) external override onlyOwner {
        _burn(to, amount);
    }
}
