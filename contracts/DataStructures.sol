// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

enum Vote {
    YES,
    NO
}

struct Proposal {
    address[] path;
    uint256 amountIn;
    uint256 voteEnd;
    uint256 yesVotes;
    uint256 noVotes;
    mapping(address => bool) voted;
}
