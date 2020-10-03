pragma solidity =0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IDAO is ERC20 {
    address public creator;
    address public investorDao;
    bool public addrSet;

    event InvestorDaoAddrSet(address by, address investorDao);
    event IdaoMinted(address user, uint256 amount);
    event IdaoBurned(address user, uint256 amount);

    modifier onlyDao() {
        require(msg.sender == investorDao, "access restricted to InvestorDao");
        _;
    }

    constructor() ERC20("IDAO", "IDAO") public {
        creator = msg.sender;
        addrSet = false;
    }

    function setInvestorDaoAddr(address _investorDao) external {
        require(_investorDao != address(0), "zero address detected");
        require(msg.sender == creator, "only creator can set the address");
        require(!addrSet, "address already set");
        
        addrSet = true;
        investorDao = _investorDao;

        emit InvestorDaoAddrSet(msg.sender, _investorDao);
    }

    function mint(address to, uint256 amount) external onlyDao {
        emit IdaoMinted(to, amount);

        _mint(to, amount);
    }

    function burn(address to, uint256 amount) external onlyDao {
        emit IdaoBurned(to, amount);

        _burn(to, amount);
    }
}