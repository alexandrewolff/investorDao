const { expectRevert, time } = require('@openzeppelin/test-helpers');
const InvestorDao = artifacts.require('InvestorDao');

contract('Proposals Handling', (accounts) => {
    let investorDao;
    const [investor1, investor2, investor3, noOne] = [accounts[1], accounts[2], accounts[3], accounts[4]];
    
    before(async () => {
        investorDao = await InvestorDao.deployed();

        await investorDao.invest({ from: investor1, value: 100 });
        await investorDao.invest({ from: investor2, value: 200 });
        await investorDao.invest({ from: investor3, value: 300 });
    });

    it('should create a proposal', async () => {
        await investorDao.createProposal(0, 'LINK', 400, { from: investor1 });

        const availableFunds = await investorDao.availableFunds();
        const proposalsAmount = await investorDao.getProposalsAmount();
        const Proposal0 = await investorDao.proposals(0);

        assert(availableFunds.toNumber() === 100 + 200 + 300 - 400, 'Wrong availableFunds amount');
        assert(proposalsAmount.toNumber() === 1, 'Wrong number of proposal');
        assert(Proposal0.id.toNumber() === 0, 'Wrong id');
        assert(Proposal0.proposalType.toNumber() === 0, 'Wrong proposal type');
        assert(Proposal0.token === 'LINK', 'Wrong token name');
        assert(Proposal0.amountToTrade.toNumber() === 400, 'Wrong amount to trade');
    });

    it('should NOT create a proposal if not enough available funds', async () => {
        await expectRevert(
            investorDao.createProposal(0, 'LINK', 400, { from: investor1 }),
            'not enough available funds'
        );
    });

    it('should NOT create a proposal if not an investor', async () => {
        await expectRevert(
            investorDao.createProposal(0, 'LINK', 400, { from: noOne }),
            'only investors'
        );
    });
});