const { expectRevert, time } = require('@openzeppelin/test-helpers');
const InvestorDao = artifacts.require('InvestorDao');

contract('Shares Handling', (accounts) => {
    let investorDao;
    const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];
    
    before(async () => {
        investorDao = await InvestorDao.deployed();
    });

    it('should accept investments', async () => {
        await investorDao.invest({ from: investor1, value: 100 });
        await investorDao.invest({ from: investor2, value: 200 });
        await investorDao.invest({ from: investor3, value: 300 });

        const shares1 = await investorDao.shares(investor1);
        const shares2 = await investorDao.shares(investor2);
        const shares3 = await investorDao.shares(investor3);
        const totalShares = await investorDao.totalShares();
        const availableFunds = await investorDao.availableFunds();

        assert(shares1.toNumber() === 100, 'Wrong share amount for investor1');
        assert(shares2.toNumber() === 200, 'Wrong share amount for investor2');
        assert(shares3.toNumber() === 300, 'Wrong share amount for investor3');
        assert(totalShares.toNumber() === 600, 'Wrong total share amount');
        assert(availableFunds.toNumber() === 600, 'Wrong available funds amount');
    });

    it('should NOT accept investment after contributionTime', async () => {
        await time.increase(31); 
        await expectRevert(
            investorDao.invest({ from: investor1, value: 100 }), 
            'cannot contribute after contributionEnd'
        );
    });

    it('should divest liquidity', async () => {
        await investorDao.divest(100, { from: investor2 });

        const shares2 = await investorDao.shares(investor2);

        assert(shares2.toNumber() === 100, 'Wrong final shares amount for investor');
    });

    it('should NOT divest liquity if not enough shares', async () => {
        await expectRevert(
            investorDao.divest(300, { from: investor1 }), 
            'not enough shares'
        );
    });

    it('should transfer shares', async () => {
        await investorDao.transferShares(100, investor1, { from: investor3 });

        const shares1 = await investorDao.shares(investor1);
        const shares3 = await investorDao.shares(investor3);

        assert(shares1.toNumber() === 200, 'Wrong final share amount for sender');
        assert(shares3.toNumber() === 200, 'Wrong final share amount for receiver');
    });

    it('should NOT transfer shares if not enough shares', async () => {
        await expectRevert(
            investorDao.transferShares(300, investor1, { from: investor2 }),
            'not enough shares'
        );
    });
});