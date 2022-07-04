import { ethers } from 'hardhat';

const contributionTime = ethers.BigNumber.from(3600);
const voteTime = ethers.BigNumber.from(3600);
const proposalValidity = ethers.BigNumber.from(3600);
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const sendEthToExecutorGas = ethers.BigNumber.from('88930');

async function main() {
  const IDAO = await ethers.getContractFactory('IDAO');
  const InvestorDao = await ethers.getContractFactory('InvestorDao');

  const idao = await IDAO.deploy();
  console.log('IDAO deployed to:', idao.address);

  const investorDao = await InvestorDao.deploy(
    contributionTime,
    voteTime,
    proposalValidity,
    idao.address,
    daiAddress,
    wethAddress,
    uniswapRouterAddress,
    sendEthToExecutorGas,
  );
  console.log('InvestorDao deployed to:', investorDao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
