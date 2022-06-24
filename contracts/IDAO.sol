// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IDAO is ERC20 {
    address public dao;

    modifier onlyDao() {
        require(msg.sender == dao, "IDAO: access restricted to DAO");
        _;
    }

    constructor(address _dao) public ERC20("IDAO", "IDAO") {
        require(_dao != address(0), "IDAO: zero address provided");
        dao = _dao;
    }

    function mint(address to, uint256 amount) external onlyDao {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) external onlyDao {
        _burn(to, amount);
    }
}
