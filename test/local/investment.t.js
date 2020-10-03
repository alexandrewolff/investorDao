// Test on local test network

const { expectRevert, time } = require('@openzeppelin/test-helpers');
const TestToken = artifacts.require('TestToken');
const IDAO = artifacts.require('IDAO');
const InvestorDao = artifacts.require('InvestorDao');

contract('Investment', (accounts) => {
    let idao, dai, investorDao;
    const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];
    
    before(async () => {
        idao = await IDAO.deployed();
        dai = await TestToken.deployed();
        investorDao = await InvestorDao.deployed();

        await dai.mint(investor1, 1000);
        await dai.mint(investor2, 1000);
        await dai.mint(investor3, 1000);

        dai.approve(investorDao.address, 1000, { from: investor1});
        dai.approve(investorDao.address, 1000, { from: investor2});
        dai.approve(investorDao.address, 1000, { from: investor3});
    });

    it('should accept investments', async () => {
        await investorDao.invest(100, { from: investor1 });
        await investorDao.invest(200, { from: investor2 });
        await investorDao.invest(300, { from: investor3 });

        const idaoAmount1 = await idao.balanceOf(investor1);
        const idaoAmount2 = await idao.balanceOf(investor2);
        const idaoAmount3 = await idao.balanceOf(investor3);
        const totalIdao = await idao.totalSupply();
        const availableFunds = await investorDao.availableFunds();

        assert(idaoAmount1.toNumber() === 100, 'Wrong share amount for investor1');
        assert(idaoAmount2.toNumber() === 200, 'Wrong share amount for investor2');
        assert(idaoAmount3.toNumber() === 300, 'Wrong share amount for investor3');
        assert(totalIdao.toNumber() === 600, 'Wrong total share amount');
        assert(availableFunds.toNumber() === 600, 'Wrong available funds amount');
    });

    it('should NOT accept investment after contributionTime', async () => {
        await time.increase(31);
        
        await expectRevert(
            investorDao.invest(100, { from: investor1 }), 
            'cannot contribute after contributionEnd'
        );
    });

    it('should divest liquidity', async () => {
        const initialDaiInvestor2 = await dai.balanceOf(investor2);

        await investorDao.divest(100, { from: investor2 });

        const finalDaiInvestor2 = await dai.balanceOf(investor2);
        const idaoInvestor2 = await idao.balanceOf(investor2);

        assert(finalDaiInvestor2.sub(initialDaiInvestor2).toNumber() === 100, 'Wrong final dai balance');
        assert(idaoInvestor2.toNumber() === 100, 'Wrong final shares amount for investor');
    });

    it('should NOT divest liquity if not enough shares', async () => {
        await expectRevert(
            investorDao.divest(300, { from: investor1 }), 
            'not enough IDAO'
        );
    });
});