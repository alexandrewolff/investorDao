import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { IDAO, InvestorDao } from '../typechain';

const {
  getSigners,
  getSigner,
  getContractFactory,
  constants: { AddressZero },
  BigNumber,
} = ethers;

describe('InvestorDAO', () => {
  const contributionTime = 3600;
  const voteTime = 600;
  const quorum = 51;
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let idao: IDAO;
  let investorDao: InvestorDao;

  before(async () => {
    [owner] = await getSigners();
    user = await getSigner('0x7c8CA1a587b2c4c40fC650dB8196eE66DC9c46F4');
  });

  beforeEach(async () => {
    const IDAO = await getContractFactory('IDAO');
    const InvestorDao = await getContractFactory('InvestorDao');
    idao = await IDAO.deploy();
    investorDao = await InvestorDao.deploy(
      contributionTime,
      voteTime,
      quorum,
      idao.address,
      daiAddress,
      uniswapRouterAddress,
    );

    await idao.transferOwnership(investorDao.address);
  });

  describe('constructor', () => {
    it('should correctly set parameters', async () => {});
  });

  // describe();
});
