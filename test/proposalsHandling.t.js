const { expectRevert, time } = require('@openzeppelin/test-helpers');
const InvestorDao = artifacts.require('InvestorDao');

contract('Proposals Handling', (accounts) => {
    let investorDao;
    const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];
    
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
        assert(Proposal0.id.toNumber() === 0);
        assert(Proposal0.proposalType.toNumber() === 0);
        assert(Proposal0.token === 'LINK');
        assert(Proposal0.amountToTrade.toNumber() === 400);
    });
});