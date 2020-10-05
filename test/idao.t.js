const { expectRevert } = require('@openzeppelin/test-helpers');
const IDAO = artifacts.require('IDAO');

contract('IDAO', (accounts) => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const validAddress = '0x0000000000000000000000000000000000000001';
    let idao;

    before(async () => {
        idao = await IDAO.new({ from: accounts[0] });
    });

    it('should NOT change DAO address with zero address', async () => {
        await expectRevert(
            idao.setInvestorDaoAddr(zeroAddress, { from: accounts[0] }),
            'zero address detected'
        );
    });

    it('should NOT change DAO address if not creator', async () => {
        await expectRevert(
            idao.setInvestorDaoAddr(validAddress, { from: accounts[1] }),
            'only creator can set the address'
        );
    });

    it('should change DAO address', async () => {
        idao.setInvestorDaoAddr(validAddress, { from: accounts[0] });

        const investorDaoAddr = await idao.investorDao();

        assert(investorDaoAddr === validAddress, 'Wrong investorDao address');
    });

    it('should NOT change DAO address if already set', async () => {
        await expectRevert(
            idao.setInvestorDaoAddr(validAddress, { from: accounts[0] }),
            'address already set'
        );
    });
});