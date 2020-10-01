const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Dao = artifacts.require('Dao');

contract('Dao', (accounts) => {
    let dao;
    const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];
    
    before(async () => {
        dao = await Dao.deployed();
    });

    it('should accept investments', async () => {
      await dao.invest({from: investor1, value: 100});
      await dao.invest({from: investor2, value: 200});
      await dao.invest({from: investor3, value: 300});

      const shares1 = await dao.shares(investor1);
      const shares2 = await dao.shares(investor2);
      const shares3 = await dao.shares(investor3);
      const totalShares = await dao.totalShares();
      const availableFunds = await dao.availableFunds();

      assert(shares1.toNumber() === 100 );
      assert(shares2.toNumber() === 200 );
      assert(shares3.toNumber() === 300 );
      assert(totalShares.toNumber() === 600);
      assert(availableFunds.toNumber() === 600);
    });

    it('should NOT accept investment after contributionTime', async () => {
      await time.increase(31); 
      await expectRevert(
        dao.invest({from: investor1, value: 100}), 
        'cannot contribute after contributionEnd'
      );
    });
});