const { expectRevert, time } = require('@openzeppelin/test-helpers');
const TestToken = artifacts.require('TestToken');
const FakeUniswapRouteur = artifacts.require('FakeUniswapRouter');
const InvestorDao = artifacts.require('InvestorDao');


const FakeUniswapPair = artifacts.require('FakeUniswapPair');


contract('Execute', (accounts) => {
    const [investor1, investor2, investor3, noOne] = [accounts[1], accounts[2], accounts[3], accounts[4]];
    let dai, wbtc, investorDao;
    let currentProposal = 0;
    
    before(async () => {
        dai = await TestToken.deployed();
        wbtc = await TestToken.new('Wrapped Bitcoin', 'WBTC');
        fakeUniswapRouter = await FakeUniswapRouteur.deployed();
        investorDao = await InvestorDao.deployed();

        fakeUniswapRouter.launchPair(dai.address, wbtc.address, 9000000000000, 100000000000);

        await dai.mint(investor1, 1000000);
        await dai.mint(investor2, 1000000);
        await dai.mint(investor3, 1000000);
        await dai.approve(investorDao.address, 10000000, { from: investor1 });
        await dai.approve(investorDao.address, 10000000, { from: investor2 });
        await dai.approve(investorDao.address, 10000000, { from: investor3 });

        await investorDao.invest(100000, { from: investor1 });
        await investorDao.invest(200000, { from: investor2 });
        await investorDao.invest(300000, { from: investor3 });

        await wbtc.mint(investorDao.address, 1000000);
    });

    it('should execute buy proposal', async () => {
        const initalDaiBalance = await dai.balanceOf(investorDao.address);
        const initalWbtcBalance = await wbtc.balanceOf(investorDao.address);

        await investorDao.createProposal(0, wbtc.address, 100000, { from: investor1 });
        
        await investorDao.vote(currentProposal, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor3 });
        
        await time.increase(21);

        await investorDao.executeProposal(currentProposal, { from: investor2 });
        
        const finalDaiBalance = await dai.balanceOf(investorDao.address);
        const finalWbtcBalance = await wbtc.balanceOf(investorDao.address);
        const Proposal = await investorDao.proposals(currentProposal);
        
        assert(finalDaiBalance.sub(initalDaiBalance).toNumber() === -100000, 'Wrong DAI balance');
        assert(finalWbtcBalance.sub(initalWbtcBalance).toNumber() > 0, 'Wrong WBTC balance');
        assert(Proposal.executed === true, 'Proposal state has not been updated');
    });

    it('should execute sell proposal', async () => {
        currentProposal++;

        const initalDaiBalance = await dai.balanceOf(investorDao.address);
        const initalWbtcBalance = await wbtc.balanceOf(investorDao.address);

        await investorDao.createProposal(1, wbtc.address, initalWbtcBalance.toNumber(), { from: investor2 });
        
        await investorDao.vote(currentProposal, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor3 });
        
        await time.increase(21);

        await investorDao.executeProposal(currentProposal, { from: investor3 });
        
        const finalDaiBalance = await dai.balanceOf(investorDao.address);
        const finalWbtcBalance = await wbtc.balanceOf(investorDao.address);
        const Proposal = await investorDao.proposals(currentProposal);
                
        assert(finalDaiBalance.sub(initalDaiBalance).toNumber() > 0, 'Wrong DAI balance');
        assert(finalWbtcBalance.toNumber() === 0, 'Wrong WBTC balance');
        assert(Proposal.executed === true, 'Proposal state has not been updated');
    });

    it('should NOT execute proposal if already executed', async () => {
        await expectRevert(
            investorDao.executeProposal(currentProposal, { from: investor1 }), 
            'cannot execute proposal already executed'
        );
    });

    it('should NOT execute proposal if vote time not ended', async () => {
        currentProposal++;

        await investorDao.createProposal(0, wbtc.address, 100000, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor3 });
        
        await expectRevert(
            investorDao.executeProposal(currentProposal, { from: investor3 }), 
            'cannot execute proposal before end date'
        );
    });

    it('should NOT execute proposal if not an investor', async () => {
        currentProposal++;

        await investorDao.createProposal(0, wbtc.address, 100000, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor3 });
        
        await time.increase(21);

        await expectRevert(
            investorDao.executeProposal(currentProposal, { from: noOne }), 
            'only investors'
        );
    });

    it('should NOT execute proposal if quorum not reached', async () => {
        currentProposal++;

        const initialAvailableFunds = await investorDao.availableFunds();
        const initialWbtcBalance = await wbtc.balanceOf(investorDao.address);

        const quorum = await investorDao.quorum();
        await investorDao.createProposal(0, wbtc.address, 100000, { from: investor2 });
        await investorDao.vote(currentProposal, { from: investor2 });

        await time.increase(21);

        await investorDao.executeProposal(currentProposal, { from: investor3 })

        const finalAvailableFunds = await investorDao.availableFunds();
        const finalWbtcBalance = await wbtc.balanceOf(investorDao.address);

        assert(finalAvailableFunds.toNumber() === initialAvailableFunds.toNumber(), 'Wrong final available funds');
        assert(finalWbtcBalance.toNumber() === initialWbtcBalance.toNumber(), 'Wrong final WBTC balance');
    });
});