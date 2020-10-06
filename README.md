# InvestorDAO

InvestorDAO is an Ethereum smart contract that enables users to invest in an investment fund publicly governed by its investors.

They can invest DAI in the DAO for a specific amount of time and receive an IDAO ERC20 token for each one of them that represents a share.

Investors are then able to make investment proposals for a specific amount and ERC20 token. If accepted by the community, the amount of DAI voted will be traded against the ERC20 thanks to a UniswapV2 integration and detained by the DAO. The investors can later make a proposal to trade the ERC20 tokens back against DAI.

The IDAO value subsequently represents the total value of ERC20 tokens detained by the DAO. They can be traded or used to redeem DAI tokens, depending on the amount available.

Next step will be to implement Aave and Compound integration to offer the possibility to invest the unused tokens.

### Test instance

You can try the protocol on the ropsten testnet at this address : 0xefb920E1fDBeE8991Ea96D2126623Ee4C63dD017 [See on Etherscan](https://ropsten.etherscan.io/address/0xefb920E1fDBeE8991Ea96D2126623Ee4C63dD017#contracts)

Contribute time limit has been bypassed on this demo to enable new participants at any time.
To invest in the DAO, you will need [test DAI from Aave](https://testnet.aave.com/faucet/DAI-0xf80a32a835f79d7787e8a8ee5721d0feafd781080x1c8756fd2b28e9426cdbdcc7e3c4d64fa9a54728).

The IDAO token address is : 0x94F426186aAC05CCF2aC637299dAE65116058a64 [See on Etherscan](https://ropsten.etherscan.io/address/0x94F426186aAC05CCF2aC637299dAE65116058a64#contracts)


## Contracts

The protocol is currently made of three contracts :

* IDAO.sol, the ERC20 token that represents the shares
* InvestorDao.sol, the main contract that handles the investments, IDAO generation & proposals
* UniswapUtilities.sol, an heritage for InvestorDao.sol that provides a function to run swaps

## InvestorDao interface

**availableFunds() view returns (uint256)**

Returns the DAO's balance of DAI less the reserved for proposal amount.

**contributionEnd() view returns (uint24)**

Returns the timestamp after which no one can invest in the DAO anymore.

**voteTime() view returns (uint24)**

Returns the amount of seconds proposals are open for votes.

**quorum() view returns (uint8)**

Returns the percentage of acceptance need for a proposal to be executable.

**getProposalsAmount() view returns (uint256)**

Returns the amount of proposals that has been created so far.

**invest(uint256 amount)**

Enables to deposit DAI during the investment time and get IDAO in return. Emits a "LiquidityInvested" event.

**divest(uint256 idaoAmount)**

Enables to withdraw DAI in exchange of IDAO. The amount of DAI received depends on the amount of available funds. Emits a "LiquidityDivested" event.

**createProposal(ProposalType proposalType, address token, uint256 amountToTrade)**

Enables to create a proposal. Requires to be an investor. Emits a "ProposalCreated" event.

**vote(uint256 proposalId)**

Enables to vote for a proposal. The vote is weighted, the IDAO the voter owns the more weight he has. Requires to be an investor. Emits a "InvestorVoted" event.

**executeProposal(uint256 proposalId)**

Enables to trigger the buy or sell once the vote time is over and the quorum is reached, or to simply free the reserved funds if the quorum is not reached. Requires to be an investor. Emits a "ProposalExecution" event.

## Events

* LiquidityInvested(address user, uint256 daiAmount)
* LiquidityDivested(address user, uint256 idaoAmount, uint256 weiAmount)
* ProposalCreated(address user, uint256 id, address token, uint256 amountToTrade, uint256 end)
* InvestorVoted(address user, uint256 investorWeight, uint256 proposalId)
* ProposalExecution(uint256 proposalId, bool validated, ProposalType proposalType, address tokenBought, uint256 amountInvested, uint256 amountReceived)

## Installation

This is a truffle environment. Use

    npm i

to install all the dependencies, then

    truffle compile

to compile the contracts.

You can then go to truffle's private blockchain with

    truffle develop

and deploy the contract with

    migrate

The protocol is now available in the console with web3 or @truffle/contract library.

## Testing

Use

    truffle test

to run the tests in the test folder.