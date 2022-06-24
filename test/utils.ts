import hre from 'hardhat';

export const impersonate = async (account: string) => {
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [account],
  });
};
