import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

// Macros
const showGasReporter = false;
const enableOptimizer = true;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: showGasReporter || enableOptimizer,
        runs: 999999,
      },
      evmVersion: 'berlin',
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_URL || '',
        blockNumber: 15018565,
      },
    },
    goerli: {
      url: process.env.GOERLI_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: showGasReporter,
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
