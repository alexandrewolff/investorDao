import { network } from 'hardhat';
import { BigNumber } from 'ethers';

export const impersonate = async (account: string) => {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [account],
  });
};

export const setTimestamp = async (timestamp: number | BigNumber) => {
  await network.provider.send('evm_setNextBlockTimestamp', [timestamp]);
};
