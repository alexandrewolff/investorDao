pragma solidity =0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Dao {
    using SafeMath for uint256;

    mapping(address => uint) public shares;

    uint public totalShares;
    uint public availableFunds;
    uint public contributionEnd;

    constructor(uint contributionTime) public {
        contributionEnd = now + contributionTime;
    }

    function invest() payable external {
        require(block.timestamp < contributionEnd, 'cannot contribute after contributionEnd');

        shares[msg.sender] = shares[msg.sender].add(msg.value);
        totalShares = totalShares.add(msg.value);
        availableFunds = availableFunds.add(msg.value);
    }
}