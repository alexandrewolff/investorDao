// Test on local test network

const { expectRevert } = require('@openzeppelin/test-helpers');
const InvestorDao = artifacts.require('InvestorDao');

contract('Constructor', (accounts) => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const validAddress = '0x0000000000000000000000000000000000000001';

    it('should NOT deploy if zero address for IDAO', async () => {
        await expectRevert(
            InvestorDao.new(30, 20, 51, zeroAddress, validAddress, validAddress),
            'zero address detected'
        );
    });

    it('should NOT deploy if zero address for DAI', async () => {
        await expectRevert(
            InvestorDao.new(30, 20, 51, validAddress, zeroAddress, validAddress),
            'zero address detected'
        );
    });

    it('should NOT deploy if zero address for Uniswap Router', async () => {
        await expectRevert(
            InvestorDao.new(30, 20, 51, validAddress, validAddress, zeroAddress),
            'zero address detected'
        );
    });
});