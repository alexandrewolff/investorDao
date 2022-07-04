# InvestorDAO

InvestorDAO is a protocol that enables users to invest in an investment fund publicly governed by its investors.

They can invest DAI in the DAO and receive IDAO tokens that represents their share in the fund.

Investors are then able to make investment proposals to swap the DAI in the fund for another token. If accepted by the community, the amount of DAI voted will be traded against the token thanks to a UniswapV2 integration and then detained by the DAO. The investors can later make a proposal to trade the tokens back against DAI.

The IDAO tokens subsequently represent the total value of all tokens detained by the DAO. They can be traded or used to redeem DAI tokens, depending on the amount available.
Considering that the DAO's funds will be invested most of the time, withdrawing DAI will always be done at the expense of a premium. Thus, the point is to rather trade the IDAO token for a price that depends on the token basket in the DAO.

## Contracts

The protocol is currently made of three contracts :

- IDAO.sol, the ERC20 token that represents the shares
- InvestorDao.sol, the main contract that handles the investments, IDAO generation & proposals

## InvestorDao

### Constructor

The constructor the the InvestorDao contract expects the following parameters.

`uint256 contributionTime` : number of seconds while the investment in the DAO will be open, starting from the moment the contract is deployed

`uint256 _voteTime` : number of seconds while the vote for proposals will be open

`uint256 _proposalValidity` : number of seconds while the proposal will be executable after vote time ended

`address _idao` : address of the IDAO token

`address _dai` : address of the DAI token

`address _weth` : address of the WETH token

`address _uniswapRouter` : address of the AMM router token (can be any fork of Uniswap)

`uint256 _sendEthToExecutorGas` : gas consumed by the `sendEthToExecutor` function. Can be approximative since the shift in price is likely to be compensated by the DAI reward

## Interface

```
idao() view returns (address)
```

Returns the address of the IDAO token used by the contract.

```
dai() view returns (address)
```

Returns the address of the DAI token used by the contract.

```
weth() view returns (address)
```

Returns the address of the WETH token used by the contract.

```
uniswapRouter() view returns (address)
```

Returns the address of the AMM router used by the contract.

```
contributionEnd() view returns (uint256)
```

Returns the timestamp after which no one can invest in the DAO anymore.

```
voteTime() view returns (uint256)
```

Returns the amount of seconds proposals are open for votes.

```
proposalValidity() view returns (uint256)
```

Returns the amount of seconds proposals are open for execution after voting period.

```
proposals(uint256 id) view returns (Proposal)
```

Returns data about a specific proposal.

```
getProposalsAmount() view returns (uint256)
```

Returns the amount of proposals that has been created so far.

```
invest(uint256 amount)
```

Enables to deposit DAI during the investment time and get IDAO in return. Emits a "LiquidityInvested" event.

```
withdraw(uint256 idaoAmount)
```

Enables to withdraw DAI in exchange of IDAO. The amount of DAI received depends on the amount that is available at the moment. Emits a "LiquidityWithdrew" event.

```
createProposal(address[] memory path, uint256 amountIn)
```

Enables to create a proposal. Requires to be an investor. Emits a "ProposalCreated" event.

```
voteProposal(uint256 id, Vote answer)
```

Enables to vote for a proposal. The vote is weighted, each IDAO the voter owns represent 1 point. Provided 0 for the answer parameter represents a Yes, 1 a No. Emits a "InvestorVoted" event.

```
executeProposal(uint256 id)
```

Enables to trigger the trade in the targeted proposal once the vote time is over, if there is strictly more yes votes than no votes. Emits a "ProposalExecuted" event.

## Events

- LiquidityInvested(address indexed user, uint256 amount)
- LiquidityWithdrew(address indexed user, uint256 idaoAmount, uint256 weiAmount)
- ProposalCreated( uint256 indexed id, address indexed proposer, address[] path, uint256 amountIn)
- InvestorVoted(uint256 indexed id, address indexed voter, Vote answer, uint256 investorWeight)
- ProposalExecuted(uint256 indexed id)

## Installation

This is a Hardhat environment. First, run `npm i`. Second, copy `.env.example`, rename it to `.env` and fill the fields.

## Testing

```
npm test
```

# Deployment

You adapt the different parameters of the contructor in the `scripts/deploy.ts` file.

Then run

```
npx hardhat run scripts/deploy.ts --network <TARGETED_NETWORK>
```

# Etherscan verification

Copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network <TARGETED_NETWORK> <DEPLOYED_CONTRACT_ADDRESS> "arguments"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by using

```
npm run test:optimized
```
