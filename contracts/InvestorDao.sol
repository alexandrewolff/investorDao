pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract InvestorDao {
    using SafeMath for uint256;

    mapping(address => uint256) public shares;

    uint256 public totalShares;
    uint256 public availableFunds;
    uint256 public contributionEnd;

    constructor(uint256 contributionTime) public {
        contributionEnd = now + contributionTime;
    }

    function invest() payable external {
        require(block.timestamp < contributionEnd, 'cannot contribute after contributionEnd');

        shares[msg.sender] = shares[msg.sender].add(msg.value); // 1 wei = 1 share
        totalShares = totalShares.add(msg.value);
        availableFunds = availableFunds.add(msg.value);
    }

    function divest(uint256 shareAmount) external {
        require(shares[msg.sender] >= shareAmount, 'not enough shares');

        shares[msg.sender] = shares[msg.sender].sub(shareAmount);
        availableFunds = availableFunds.sub(shareAmount);
        uint256 weiOut = availableFunds.mul(shareAmount).div(totalShares);

        require(availableFunds >= weiOut, 'not enough available funds');

        msg.sender.transfer(weiOut);
    }
    
    function transferShares(uint256 shareAmount, address to) external {
        require(shares[msg.sender] >= shareAmount, 'not enough shares');

        shares[msg.sender] = shares[msg.sender].sub(shareAmount);
        shares[to] = shares[to].add(shareAmount);
    }
}