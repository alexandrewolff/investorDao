import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { IDAO } from '../typechain';

const {
  getSigners,
  getContractFactory,
  constants: { AddressZero },
  BigNumber,
} = ethers;

describe('IDAO', () => {
  let owner: SignerWithAddress;
  let dao: SignerWithAddress;
  let user: SignerWithAddress;
  let idao: IDAO;

  beforeEach(async () => {
    [owner, dao, user] = await getSigners();

    const IDAO = await getContractFactory('IDAO');
    idao = await IDAO.deploy();
    await idao.transferOwnership(dao.address);
  });

  describe('mint', () => {
    it('should mint', async () => {
      const amountToMint = BigNumber.from('1000000000000');
      await idao.connect(dao).mint(user.address, amountToMint);
      expect(await idao.balanceOf(user.address)).equal(amountToMint);
    });

    it('should emit Transfer event', async () => {
      const amountToMint = BigNumber.from('1000000000000');
      await expect(idao.connect(dao).mint(user.address, amountToMint))
        .to.emit(idao, 'Transfer')
        .withArgs(AddressZero, user.address, amountToMint);
    });

    it('should not mint if not from dao', async () => {
      await expect(
        idao.connect(user).mint(user.address, 1000),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('burn', () => {
    const amount = BigNumber.from('1000000000000');

    beforeEach(async () => {
      await idao.connect(dao).mint(user.address, amount);
    });

    it('should burn', async () => {
      await idao.connect(dao).burn(user.address, amount);
      expect(await idao.balanceOf(user.address)).equal(0);
    });

    it('should emit Transfer event', async () => {
      await expect(idao.connect(dao).burn(user.address, amount))
        .to.emit(idao, 'Transfer')
        .withArgs(user.address, AddressZero, amount);
    });

    it('should not burn if not from dao', async () => {
      await expect(
        idao.connect(user).burn(user.address, 1000),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
