pragma solidity =0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IIDAO is IERC20 {
    function setInvestorDaoAddr(address investorDao) external;
    function mint(address to, uint256 amount) external;
    function burn(address to, uint256 amount) external;

    event InvestorDaoAddrSet(address by, address investorDao);
    event IdaoMinted(address user, uint256 amount);
    event IdaoBurned(address user, uint256 amount);
}
