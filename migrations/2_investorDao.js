const IDAO = artifacts.require('IDAO');
const TestToken = artifacts.require('TestToken');
const FakeUniswapRouter = artifacts.require('FakeUniswapRouter');
const InvestorDao = artifacts.require('InvestorDao');

module.exports = async function(deployer, network) {
    if (network === 'ropsten') {
        const daiToken = '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108';
        const uniswapV2Router02 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

        await deployer.deploy(IDAO);
        await deployer.deploy(InvestorDao, 3600, 600, 51, IDAO.address, daiToken, uniswapV2Router02);

        const idao = await IDAO.deployed();
        await idao.setInvestorDaoAddr(InvestorDao.address);
    } else {
        await deployer.deploy(IDAO);
        await deployer.deploy(TestToken, 'DAI', 'DAI');
        await deployer.deploy(FakeUniswapRouter);
        await deployer.deploy(InvestorDao, 30, 20, 51, IDAO.address, TestToken.address, FakeUniswapRouter.address);

        const idao = await IDAO.deployed();
        await idao.setInvestorDaoAddr(InvestorDao.address);
    }
};
