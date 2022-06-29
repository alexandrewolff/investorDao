import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IDAO, InvestorDao } from '../typechain';
import { impersonate, setTimestamp } from './utils';
import daiAbi from '../abis/dai.abi.json';

const {
  getSigners,
  getSigner,
  getContractFactory,
  constants: { AddressZero, MaxUint256 },
  BigNumber,
  provider,
} = ethers;

describe('InvestorDAO', () => {
  const contributionTime = BigNumber.from(3600);
  const voteTime = BigNumber.from(600);
  const quorum = BigNumber.from(51);
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let dai: Contract;
  let idao: IDAO;
  let investorDao: InvestorDao;

  before(async () => {
    [owner] = await getSigners();
    const daiWhale = '0x7c8CA1a587b2c4c40fC650dB8196eE66DC9c46F4';
    await impersonate(daiWhale);
    user = await getSigner(daiWhale);

    dai = new Contract(daiAddress, daiAbi, owner);
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
    it('should correctly set parameters', async () => {
      const timestamp = BigNumber.from(
        (await provider.getBlock(await provider.getBlockNumber())).timestamp,
      );

      expect(await investorDao.contributionEnd()).closeTo(
        timestamp.add(contributionTime),
        1,
        'contributionEnd test failed',
      );
      expect(await investorDao.voteTime()).equal(
        voteTime,
        'voteTime test failed',
      );
      expect(await investorDao.quorum()).equal(quorum, 'quorum test failed');
      expect(await investorDao.idao()).equal(idao.address, 'idao test failed');
      expect(await investorDao.dai()).equal(daiAddress, 'dai test failed');
      expect(await investorDao.uniswapRouter()).equal(
        uniswapRouterAddress,
        'uniswapRouter test failed',
      );
    });
  });

  describe('invest', () => {
    const amountInvested = BigNumber.from('20000000000000');

    beforeEach(async () => {
      await dai.connect(user).approve(investorDao.address, MaxUint256);
    });

    it('should invest', async () => {
      await investorDao.connect(user).invest(amountInvested);
      expect(await investorDao.availableFunds()).equal(amountInvested);
    });

    it('should emit LiquidityInvested event', async () => {
      await expect(investorDao.connect(user).invest(amountInvested))
        .to.emit(investorDao, 'LiquidityInvested')
        .withArgs(user.address, amountInvested);
    });

    it('should transfer DAI', async () => {
      await expect(() =>
        investorDao.connect(user).invest(amountInvested),
      ).to.changeTokenBalance(dai, investorDao, amountInvested);
    });

    it('should mint IDAO', async () => {
      await expect(() =>
        investorDao.connect(user).invest(amountInvested),
      ).to.changeTokenBalance(idao, user, amountInvested);
    });

    it('should not contribute after contributionEnd', async () => {
      await setTimestamp(await investorDao.contributionEnd());
      await expect(
        investorDao.connect(user).invest(amountInvested),
      ).to.be.revertedWith(
        'InvestorDao: cannot contribute after contributionEnd',
      );
    });
  });

  describe.only('withdraw', () => {
    const amountInvested = BigNumber.from('20000000000000');

    beforeEach(async () => {
      await dai.connect(user).approve(investorDao.address, MaxUint256);
      await investorDao.connect(user).invest(amountInvested);

      // Add a second investor
      const ownerAmount = 1000000;
      await dai.connect(user).transfer(owner.address, ownerAmount);
      await dai.connect(owner).approve(investorDao.address, ownerAmount);
      await investorDao.connect(owner).invest(ownerAmount);
    });

    it('should withdraw', async () => {
      const initialFunds = await investorDao.availableFunds();
      await investorDao.connect(user).withdraw(amountInvested);

      expect(await investorDao.availableFunds()).equal(
        initialFunds.sub(amountInvested),
      );
    });

    it('should emit LiquidityWithdrew event', async () => {
      await expect(investorDao.connect(user).withdraw(amountInvested))
        .to.emit(investorDao, 'LiquidityWithdrew')
        .withArgs(user.address, amountInvested, amountInvested);
    });

    it('should withdraw DAI', async () => {
      await expect(() =>
        investorDao.connect(user).withdraw(amountInvested),
      ).to.changeTokenBalance(dai, user, amountInvested);
    });

    it('should burn IDAO', async () => {
      await expect(() =>
        investorDao.connect(user).withdraw(amountInvested),
      ).to.changeTokenBalance(idao, user, amountInvested.mul(-1));
    });

    it('should not withdraw if not enough IDAO', async () => {
      await expect(
        investorDao.connect(user).withdraw(amountInvested.add(1)),
      ).to.be.revertedWith('ERC20: burn amount exceeds balance');
    });
  });
});
