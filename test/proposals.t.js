const { expectRevert, time } = require('@openzeppelin/test-helpers');
const TestToken = artifacts.require('TestToken');
const IDAO = artifacts.require('IDAO');
const InvestorDao = artifacts.require('InvestorDao');

contract('Proposals', (accounts) => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const validAddress = '0x0000000000000000000000000000000000000001';
    const [investor1, investor2, investor3, noOne] = [accounts[1], accounts[2], accounts[3], accounts[4]];
    let dai, idao, testToken, investorDao;
    
    before(async () => {
        dai = await TestToken.deployed();
        idao = await IDAO.deployed();
        testToken = await TestToken.new('Test Token', 'TTK');
        investorDao = await InvestorDao.deployed();

        await dai.mint(investor1, 1000);
        await dai.mint(investor2, 1000);
        await dai.mint(investor3, 1000);

        await dai.approve(investorDao.address, 1000, { from: investor1 });
        await dai.approve(investorDao.address, 1000, { from: investor2 });
        await dai.approve(investorDao.address, 1000, { from: investor3 });

        investorDao.invest(300, { from: investor3 });
        investorDao.invest(100, { from: investor1 });
        investorDao.invest(200, { from: investor2 });
    });

    it('should create a buy proposal', async () => {
        await investorDao.createProposal(0, validAddress, 400, { from: investor1 });

        const availableFunds = await investorDao.availableFunds();
        const proposalsAmount = await investorDao.getProposalsAmount();
        const Proposal0 = await investorDao.proposals(0);

        assert(availableFunds.toNumber() === 100 + 200 + 300 - 400, 'Wrong availableFunds amount');
        assert(proposalsAmount.toNumber() === 1, 'Wrong number of proposal');
        assert(Proposal0.id.toNumber() === 0, 'Wrong id');
        assert(Proposal0.proposalType.toNumber() === 0, 'Wrong proposal type');
        assert(Proposal0.token === validAddress, 'Wrong token name');
        assert(Proposal0.amountToTrade.toNumber() === 400, 'Wrong amount to trade');
    });

    it('should NOT create a buy proposal if not an investor', async () => {
        await expectRevert(
            investorDao.createProposal(0, validAddress, 400, { from: noOne }),
            'only investors'
        );
    });

    it('should NOT create a buy proposal if not enough available funds', async () => {
        await expectRevert(
            investorDao.createProposal(0, validAddress, 400, { from: investor1 }),
            'not enough available funds'
        );
    });

    it('should NOT create a buy proposal if zero address for token', async () => {
        await expectRevert(
            investorDao.createProposal(0, zeroAddress, 400, { from: investor1 }),
            'zero address detected'
        );
    });

    it('should NOT create a sell proposal if not enough token', async () => {
        await expectRevert(
            investorDao.createProposal(1, testToken.address, 50, { from: investor1 }),
            'not enough tokens to sell'
        );
    });

    it('should vote', async () => {
        await investorDao.vote(0, { from: investor1 });

        const investor1Weight = await idao.balanceOf(investor1);
        const Proposal0 = await investorDao.proposals(0);

        assert(Proposal0.votes.toNumber() === investor1Weight.toNumber(), 'Wrong number of votes');
    });

    it('should NOT vote if not an investor', async () => {
        await expectRevert(
            investorDao.vote(0, { from: noOne }),
            'only investors'
        );
    });

    it('should NOT vote if already voted', async () => {
        await expectRevert(
            investorDao.vote(0, { from: investor1 }),
            'investor can only vote once for a proposal'
        );
    });

    it('should NOT vote after proposal end', async () => {
        await time.increase(21);

        await expectRevert(
            investorDao.vote(0, { from: investor2 }),
            'can only vote until proposal end date'
        );
    });
});