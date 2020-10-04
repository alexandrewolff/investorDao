const TestToken = artifacts.require('TestToken');
const IDAO = artifacts.require('IDAO');
const InvestorDao = artifacts.require('InvestorDao');

module.exports = async function(deployer, network) {
    // if (network === 'ganache') {
        await deployer.deploy(TestToken, 'DAI', 'DAI');
        await deployer.deploy(IDAO);
        await deployer.deploy(InvestorDao, 30, 20, 51, IDAO.address, TestToken.address, '0x0000000000000000000000000000000000000001');

        const idao = await IDAO.deployed();
        await idao.setInvestorDaoAddr(InvestorDao.address);
    // } else if (network === 'ropsten') {
    //     const daiToken = 0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108;
    //     const uniswapV2Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    //     deployer.deploy(IDAO).then(function() {
    //         return deployer.deploy(InvestorDao, 30, 20, IDAO.address, daiToken, uniswapV2Router02);
    //     });

    //     IDAO.deployed().then(function(idao) {
    //         idao.setInvestorDaoAddr(InvestorDao.address);
    //     });
    // }
};
