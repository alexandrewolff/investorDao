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
  const mkrAddress = '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2';
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

  describe('withdraw', () => {
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

  describe('createProposal', () => {
    const amountInvested = BigNumber.from('20000000000000');

    beforeEach(async () => {
      await dai.connect(user).approve(investorDao.address, MaxUint256);
      await investorDao.connect(user).invest(amountInvested);
    });

    it('should create proposal', async () => {
      const timestamp = BigNumber.from(
        (await provider.getBlock(await provider.getBlockNumber())).timestamp,
      );

      await investorDao
        .connect(user)
        .createProposal(0, mkrAddress, amountInvested);
      const { proposalType, token, amountIn, voteEnd, yesVotes, noVotes } =
        await investorDao.proposals(0);

      expect(voteEnd).closeTo(
        timestamp.add(voteTime),
        1,
        'voteEnd test failed',
      );
      expect(proposalType).equal(0, 'proposalType test failed');
      expect(token).equal(mkrAddress, 'token test failed');
      expect(amountIn).equal(amountInvested, 'amountIn test failed');
      expect(yesVotes).equal(0, 'yesVotes test failed');
      expect(noVotes).equal(0, 'noVotes test failed');
    });

    it('should emit ProposalCreated event', async () => {
      await expect(
        investorDao.connect(user).createProposal(0, mkrAddress, amountInvested),
      )
        .to.emit(investorDao, 'ProposalCreated')
        .withArgs(0, user.address, 0, mkrAddress, amountInvested);
    });

    it('should not create proposal if not investor', async () => {
      await expect(
        investorDao
          .connect(owner)
          .createProposal(0, mkrAddress, amountInvested),
      ).to.be.revertedWith('InvestorDao: access restricted to investors');
    });

    it('should not create proposal with zero address for token', async () => {
      await expect(
        investorDao
          .connect(user)
          .createProposal(0, AddressZero, amountInvested),
      ).to.be.revertedWith('InvestorDao: zero address provided');
    });
  });

  describe.only('vote', () => {
    const amountInvested = BigNumber.from('20000000000000');

    beforeEach(async () => {
      await dai.connect(user).approve(investorDao.address, MaxUint256);
      await investorDao.connect(user).invest(amountInvested);
      await investorDao
        .connect(user)
        .createProposal(0, mkrAddress, amountInvested);
    });

    it('should vote yes', async () => {
      await investorDao.connect(user).vote(0, 0);
      expect((await investorDao.proposals(0)).yesVotes).equal(amountInvested);
    });

    it('should vote no', async () => {
      await investorDao.connect(user).vote(0, 1);
      expect((await investorDao.proposals(0)).noVotes).equal(amountInvested);
    });

    it('should emit InvestorVoted event', async () => {
      await expect(investorDao.connect(user).vote(0, 0))
        .to.emit(investorDao, 'InvestorVoted')
        .withArgs(0, user.address, 0, amountInvested);
    });

    it('should not vote if unexistant proposal', async () => {
      await expect(investorDao.connect(user).vote(1, 0)).to.be.revertedWith(
        'InvestorDao: proposal does not exist',
      );
    });

    it('should not vote if already voted', async () => {
      await investorDao.connect(user).vote(0, 0);
      await expect(investorDao.connect(user).vote(0, 0)).to.be.revertedWith(
        'InvestorDao: investor already voted',
      );
    });

    it('should not vote if vote period ended', async () => {
      const voteEnd = (await investorDao.proposals(0)).voteEnd;
      await setTimestamp(voteEnd);
      await expect(investorDao.connect(user).vote(0, 0)).to.be.revertedWith(
        'InvestorDao: vote period ended',
      );
    });

    it('should not increase yes vote if not investor', async () => {
      expect(investorDao.connect(owner).vote(0, 0));
      expect((await investorDao.proposals(0)).yesVotes).equal(0);
    });

    it('should not increase no vote if not investor', async () => {
      expect(investorDao.connect(owner).vote(0, 1));
      expect((await investorDao.proposals(0)).noVotes).equal(0);
    });
  });
});
