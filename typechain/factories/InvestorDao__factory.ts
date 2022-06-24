/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { InvestorDao, InvestorDaoInterface } from "../InvestorDao";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint24",
        name: "contributionTime",
        type: "uint24",
      },
      {
        internalType: "uint24",
        name: "_voteTime",
        type: "uint24",
      },
      {
        internalType: "uint8",
        name: "_quorum",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_idaoToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_daiToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "uniswapV2Router02",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "investorWeight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "InvestorVoted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "idaoAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weiAmount",
        type: "uint256",
      },
    ],
    name: "LiquidityDivested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "daiAmount",
        type: "uint256",
      },
    ],
    name: "LiquidityInvested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountToTrade",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "validated",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "enum InvestorDao.ProposalType",
        name: "proposalType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenBought",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountInvested",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountReceived",
        type: "uint256",
      },
    ],
    name: "ProposalExecution",
    type: "event",
  },
  {
    inputs: [],
    name: "availableFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contributionEnd",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum InvestorDao.ProposalType",
        name: "proposalType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountToTrade",
        type: "uint256",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "idaoAmount",
        type: "uint256",
      },
    ],
    name: "divest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "executeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProposalsAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "invest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint16",
        name: "id",
        type: "uint16",
      },
      {
        internalType: "uint40",
        name: "end",
        type: "uint40",
      },
      {
        internalType: "enum InvestorDao.ProposalType",
        name: "proposalType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountToTrade",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quorum",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "voteTime",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200290938038062002909833981810160405260c08110156200003757600080fd5b8101908080519060200190929190805190602001909291908051906020019092919080519060200190929190805190602001909291908051906020019092919050505080806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141562000160576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f7a65726f2061646472657373206465746563746564000000000000000000000081525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000204576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f7a65726f2061646472657373206465746563746564000000000000000000000081525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415620002a8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f7a65726f2061646472657373206465746563746564000000000000000000000081525060200191505060405180910390fd5b6000600381905550620002cf8662ffffff1642620003b560201b62001c7d1790919060201c565b600460006101000a81548162ffffff021916908362ffffff16021790555084600460036101000a81548162ffffff021916908362ffffff16021790555083600460066101000a81548160ff021916908360ff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050506200043e565b60008082840190508381101562000434576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b6124bb806200044e6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c8063839111a411610071578063839111a41461021c5780638ca179951461023a578063ba7d230114610268578063bcf93dd6146102c3578063c591aa98146102e6578063d151b5161461034a576100b4565b80630121b93f146100b9578063013cf08b146100e75780630d61b519146101815780631703a018146101af5780632afcf480146101d057806346fcff4c146101fe575b600080fd5b6100e5600480360360208110156100cf57600080fd5b810190808035906020019092919050505061036d565b005b610113600480360360208110156100fd57600080fd5b81019080803590602001909291905050506107a5565b604051808861ffff1681526020018764ffffffffff16815260200186600181111561013a57fe5b81526020018573ffffffffffffffffffffffffffffffffffffffff168152602001848152602001838152602001821515815260200197505050505050505060405180910390f35b6101ad6004803603602081101561019757600080fd5b810190808035906020019092919050505061084d565b005b6101b7610fa6565b604051808260ff16815260200191505060405180910390f35b6101fc600480360360208110156101e657600080fd5b8101908080359060200190929190505050610fb9565b005b610206611237565b6040518082815260200191505060405180910390f35b61022461123d565b6040518082815260200191505060405180910390f35b6102666004803603602081101561025057600080fd5b810190808035906020019092919050505061124a565b005b6102c16004803603606081101561027e57600080fd5b81019080803560ff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611608565b005b6102cb611c24565b604051808262ffffff16815260200191505060405180910390f35b610332600480360360408110156102fc57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611c39565b60405180821515815260200191505060405180910390f35b610352611c68565b604051808262ffffff16815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156103f857600080fd5b505afa15801561040c573d6000803e3d6000fd5b505050506040513d602081101561042257600080fd5b8101908080519060200190929190505050116104a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f6f6e6c7920696e766573746f727300000000000000000000000000000000000081525060200191505060405180910390fd5b6000600582815481106104b557fe5b906000526020600020906004020190506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561055057600080fd5b505afa158015610564573d6000803e3d6000fd5b505050506040513d602081101561057a57600080fd5b8101908080519060200190929190505050905060001515600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600085815260200190815260200160002060009054906101000a900460ff16151514610647576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a8152602001806123a0602a913960400191505060405180910390fd5b8160000160029054906101000a900464ffffffffff1664ffffffffff1642106106bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806123eb6025913960400191505060405180910390fd5b6001600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600085815260200190815260200160002060006101000a81548160ff02191690831515021790555061073b818360020154611c7d90919063ffffffff16565b82600201819055507f4416cda70f89f39d99477b1e02e33d1f9cf9afc99ce533fefc661126a7373162338285604051808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a1505050565b600581815481106107b257fe5b90600052602060002090600402016000915090508060000160009054906101000a900461ffff16908060000160029054906101000a900464ffffffffff16908060000160079054906101000a900460ff16908060000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030160009054906101000a900460ff16905087565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156108d857600080fd5b505afa1580156108ec573d6000803e3d6000fd5b505050506040513d602081101561090257600080fd5b810190808051906020019092919050505011610986576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f6f6e6c7920696e766573746f727300000000000000000000000000000000000081525060200191505060405180910390fd5b60006005828154811061099557fe5b906000526020600020906004020190506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b158015610a0f57600080fd5b505afa158015610a23573d6000803e3d6000fd5b505050506040513d6020811015610a3957600080fd5b810190808051906020019092919050505090506000610a7882610a6a60648660020154611d0590919063ffffffff16565b611d8b90919063ffffffff16565b90508260000160029054906101000a900464ffffffffff1664ffffffffff16421015610aef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260278152602001806124386027913960400191505060405180910390fd5b600015158360030160009054906101000a900460ff16151514610b5d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806124106028913960400191505060405180910390fd5b60018360030160006101000a81548160ff021916908315150217905550600460069054906101000a900460ff1660ff168110610ead5760006001811115610ba057fe5b8360000160079054906101000a900460ff166001811115610bbd57fe5b1415610d08576060610c1a8460010154600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168660000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611e14565b90507fa879ddb3c381a97f9c80a3402e35c5ef127617475f0cc49bc816c369966de5b88460000160009054906101000a900461ffff1660018660000160079054906101000a900460ff168760000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff16886001015486600181518110610c9b57fe5b6020026020010151604051808761ffff1681526020018615158152602001856001811115610cc557fe5b81526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001965050505050505060405180910390a150610ea8565b600180811115610d1457fe5b8360000160079054906101000a900460ff166001811115610d3157fe5b1415610ea7576060610d8e84600101548560000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611e14565b9050610db981600181518110610da057fe5b6020026020010151600354611c7d90919063ffffffff16565b6003819055507fa879ddb3c381a97f9c80a3402e35c5ef127617475f0cc49bc816c369966de5b88460000160009054906101000a900461ffff1660018660000160079054906101000a900460ff168760000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff16886001015486600181518110610e3e57fe5b6020026020010151604051808761ffff1681526020018615158152602001856001811115610e6857fe5b81526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001965050505050505060405180910390a1505b5b610fa0565b610ec68360010154600354611c7d90919063ffffffff16565b6003819055507fa879ddb3c381a97f9c80a3402e35c5ef127617475f0cc49bc816c369966de5b88360000160009054906101000a900461ffff1660008560000160079054906101000a900460ff168660000160089054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600101546000604051808761ffff1681526020018615158152602001856001811115610f6257fe5b81526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001965050505050505060405180910390a15b50505050565b600460069054906101000a900460ff1681565b600460009054906101000a900462ffffff1662ffffff164262ffffff161061102c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602781526020018061245f6027913960400191505060405180910390fd5b61104181600354611c7d90919063ffffffff16565b6003819055507f63ee6c7aa7a7705514e35386a10debbe5e9a08422c704c05e6afbcf2d87c30af3382604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561114d57600080fd5b505af1158015611161573d6000803e3d6000fd5b505050506040513d602081101561117757600080fd5b810190808051906020019092919050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f1933836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561121c57600080fd5b505af1158015611230573d6000803e3d6000fd5b5050505050565b60035481565b6000600580549050905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050818173ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156112d957600080fd5b505afa1580156112ed573d6000803e3d6000fd5b505050506040513d602081101561130357600080fd5b81019080805190602001909291905050501015611388576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f6e6f7420656e6f756768204944414f000000000000000000000000000000000081525060200191505060405180910390fd5b60006114318273ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156113d357600080fd5b505afa1580156113e7573d6000803e3d6000fd5b505050506040513d60208110156113fd57600080fd5b810190808051906020019092919050505061142385600354611d0590919063ffffffff16565b611d8b90919063ffffffff16565b90506114488160035461231c90919063ffffffff16565b6003819055507f5daeecf2cc7ecf241998b4e6e964b3c8a1e00d0c7c3d23b9f5bdefc5a5783cd2338483604051808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a18173ffffffffffffffffffffffffffffffffffffffff16639dc29fac33856040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561151c57600080fd5b505af1158015611530573d6000803e3d6000fd5b50505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b1580156115c757600080fd5b505af11580156115db573d6000803e3d6000fd5b505050506040513d60208110156115f157600080fd5b810190808051906020019092919050505050505050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561169357600080fd5b505afa1580156116a7573d6000803e3d6000fd5b505050506040513d60208110156116bd57600080fd5b810190808051906020019092919050505011611741576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f6f6e6c7920696e766573746f727300000000000000000000000000000000000081525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156117e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f7a65726f2061646472657373206465746563746564000000000000000000000081525060200191505060405180910390fd5b600060018111156117f157fe5b8360018111156117fd57fe5b141561189b5780600354101561187b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f6e6f7420656e6f75676820617661696c61626c652066756e647300000000000081525060200191505060405180910390fd5b6118908160035461231c90919063ffffffff16565b6003819055506119d8565b6001808111156118a757fe5b8360018111156118b357fe5b14156119d75760008273ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561192257600080fd5b505afa158015611936573d6000803e3d6000fd5b505050506040513d602081101561194c57600080fd5b81019080805190602001909291905050509050808211156119d5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260198152602001807f6e6f7420656e6f75676820746f6b656e7320746f2073656c6c0000000000000081525060200191505060405180910390fd5b505b5b600060058054905090506000611a0d600460039054906101000a900462ffffff1662ffffff1642611c7d90919063ffffffff16565b905060056040518060e001604052808461ffff1681526020018364ffffffffff168152602001876001811115611a3f57fe5b81526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020016000815260200160001515815250908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a81548161ffff021916908361ffff16021790555060208201518160000160026101000a81548164ffffffffff021916908364ffffffffff16021790555060408201518160000160076101000a81548160ff02191690836001811115611b0d57fe5b021790555060608201518160000160086101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080820151816001015560a0820151816002015560c08201518160030160006101000a81548160ff02191690831515021790555050507f2afe7b700b22025ddd6ac92a9252fd5d2c7e9102c59986e01ca8b5224ec980253383868685604051808673ffffffffffffffffffffffffffffffffffffffff1681526020018561ffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018264ffffffffff1681526020019550505050505060405180910390a15050505050565b600460039054906101000a900462ffffff1681565b60066020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b600460009054906101000a900462ffffff1681565b600080828401905083811015611cfb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b600080831415611d185760009050611d85565b6000828402905082848281611d2957fe5b0414611d80576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806123ca6021913960400191505060405180910390fd5b809150505b92915050565b6000808211611e02576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f536166654d6174683a206469766973696f6e206279207a65726f00000000000081525060200191505060405180910390fd5b818381611e0b57fe5b04905092915050565b606080600267ffffffffffffffff81118015611e2f57600080fd5b50604051908082528060200260200182016040528015611e5e5781602001602082028036833780820191505090505b5090508381600081518110611e6f57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508281600181518110611eb757fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508373ffffffffffffffffffffffffffffffffffffffff1663095ea7b360008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16876040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015611f8257600080fd5b505af1158015611f96573d6000803e3d6000fd5b505050506040513d6020811015611fac57600080fd5b81019080805190602001909291905050505060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060608173ffffffffffffffffffffffffffffffffffffffff1663d06ca61f88856040518363ffffffff1660e01b81526004018083815260200180602001828103825283818151815260200191508051906020019060200280838360005b8381101561205c578082015181840152602081019050612041565b50505050905001935050505060006040518083038186803b15801561208057600080fd5b505afa158015612094573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525060208110156120be57600080fd5b81019080805160405193929190846401000000008211156120de57600080fd5b838201915060208201858111156120f457600080fd5b825186602082028301116401000000008211171561211157600080fd5b8083526020830192505050908051906020019060200280838360005b8381101561214857808201518184015260208101905061212d565b5050505090500160405250505090508173ffffffffffffffffffffffffffffffffffffffff166338ed1739888360018751038151811061218457fe5b60200260200101518630600c42016040518663ffffffff1660e01b815260040180868152602001858152602001806020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825285818151815260200191508051906020019060200280838360005b838110156122125780820151818401526020810190506121f7565b505050509050019650505050505050600060405180830381600087803b15801561223b57600080fd5b505af115801561224f573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250602081101561227957600080fd5b810190808051604051939291908464010000000082111561229957600080fd5b838201915060208201858111156122af57600080fd5b82518660208202830111640100000000821117156122cc57600080fd5b8083526020830192505050908051906020019060200280838360005b838110156123035780820151818401526020810190506122e8565b5050505090500160405250505093505050509392505050565b600082821115612394576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525060200191505060405180910390fd5b81830390509291505056fe696e766573746f722063616e206f6e6c7920766f7465206f6e636520666f7220612070726f706f73616c536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f7763616e206f6e6c7920766f746520756e74696c2070726f706f73616c20656e64206461746563616e6e6f7420657865637574652070726f706f73616c20616c726561647920657865637574656463616e6e6f7420657865637574652070726f706f73616c206265666f726520656e64206461746563616e6e6f7420636f6e7472696275746520616674657220636f6e747269627574696f6e456e64a2646970667358221220cbbe4e8d8009e692e5f84cce59c85e95872e1f2c57618e12e38e6428e302353964736f6c634300060c0033";

export class InvestorDao__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    contributionTime: BigNumberish,
    _voteTime: BigNumberish,
    _quorum: BigNumberish,
    _idaoToken: string,
    _daiToken: string,
    uniswapV2Router02: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InvestorDao> {
    return super.deploy(
      contributionTime,
      _voteTime,
      _quorum,
      _idaoToken,
      _daiToken,
      uniswapV2Router02,
      overrides || {}
    ) as Promise<InvestorDao>;
  }
  getDeployTransaction(
    contributionTime: BigNumberish,
    _voteTime: BigNumberish,
    _quorum: BigNumberish,
    _idaoToken: string,
    _daiToken: string,
    uniswapV2Router02: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      contributionTime,
      _voteTime,
      _quorum,
      _idaoToken,
      _daiToken,
      uniswapV2Router02,
      overrides || {}
    );
  }
  attach(address: string): InvestorDao {
    return super.attach(address) as InvestorDao;
  }
  connect(signer: Signer): InvestorDao__factory {
    return super.connect(signer) as InvestorDao__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InvestorDaoInterface {
    return new utils.Interface(_abi) as InvestorDaoInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InvestorDao {
    return new Contract(address, _abi, signerOrProvider) as InvestorDao;
  }
}
