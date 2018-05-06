import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';

import AsyncAF from '../../../dist/async-af';

chai.use(chaiAsPromised);

describe('indexOfAF method', () => {
  it('should have the same arity as native indexOf', () => {
    expect(AsyncAF([]).indexOfAF.length)
      .to.equal([].indexOf.length)
      .and.to.equal(''.indexOf.length);
    expect(AsyncAF.prototype.indexOfAF.length)
      .to.equal(Array.prototype.indexOf.length)
      .and.to.equal(String.prototype.indexOf.length);
  });

  context('should work on an array of non-promises', () => {
    const nums = [1, 2, 4];
    it('and return the first index of the specified element', async () => {
      expect(await AsyncAF(nums).indexOfAF(1)).to.equal(0);
    });
    it('and return -1 if the array doesn\'t include the specified element', async () => {
      expect(await AsyncAF(nums).indexOfAF(5)).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(nums).indexOfAF(1, 1)).to.equal(-1);
      expect(await AsyncAF(nums).indexOfAF(2, 1)).to.equal(1);
      expect(await AsyncAF(nums).indexOfAF(2, -100)).to.equal(1);
      expect(await AsyncAF(nums).indexOfAF(2, 100)).to.equal(-1);
    });
  });

  context('should work on a string', () => {
    const str = 'test string';
    it('and return the first index of the specified string', async () => {
      expect(await AsyncAF(str).indexOfAF('test')).to.equal(0);
    });
    it('and return -1 if the string doesn\'t include the specified string', async () => {
      expect(await AsyncAF(str).indexOfAF('xyz')).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(str).indexOfAF('test', 5)).to.equal(-1);
      expect(await AsyncAF(str).indexOfAF('string', 5)).to.equal(5);
      expect(await AsyncAF(str).indexOfAF('test string', 100)).to.equal(-1);
      expect(await AsyncAF(str).indexOfAF('test string', -100)).to.equal(0);
    });
  });

  context('should work on an array-like object', () => {
    const arrLike = {0: 1, 1: 2, 2: 4, length: 3};
    it('and return the first index of the specified element', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(2)).to.equal(1);
    });
    it('and return -1 if the array doesn\'t include the specified element', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(5)).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(1, 1)).to.equal(-1);
      expect(await AsyncAF(arrLike).indexOfAF(2, 1)).to.equal(1);
      expect(await AsyncAF(arrLike).indexOfAF(2, -100)).to.equal(1);
      expect(await AsyncAF(arrLike).indexOfAF(2, 100)).to.equal(-1);
    });
  });

  context('should work on an array of promises', () => {
    const nums = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(4)];
    it('and return the first index of the specified element', async () => {
      expect(await AsyncAF(nums).indexOfAF(1)).to.equal(0);
    });
    it('and return -1 if the array doesn\'t include the specified element', async () => {
      expect(await AsyncAF(nums).indexOfAF(5)).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(nums).indexOfAF(1, 1)).to.equal(-1);
      expect(await AsyncAF(nums).indexOfAF(2, 1)).to.equal(1);
      expect(await AsyncAF(nums).indexOfAF(2, -100)).to.equal(1);
      expect(await AsyncAF(nums).indexOfAF(2, 100)).to.equal(-1);
    });
  });

  context('should work on a promise that resolves to a string', () => {
    const str = Promise.resolve('test string');
    it('and return the first index of the specified string', async () => {
      expect(await AsyncAF(str).indexOfAF('test')).to.equal(0);
    });
    it('and return -1 if the string doesn\'t include the specified string', async () => {
      expect(await AsyncAF(str).indexOfAF('xyz')).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(str).indexOfAF('test', 5)).to.equal(-1);
      expect(await AsyncAF(str).indexOfAF('string', 5)).to.equal(5);
      expect(await AsyncAF(str).indexOfAF('test string', 100)).to.equal(-1);
      expect(await AsyncAF(str).indexOfAF('test string', -100)).to.equal(0);
    });
  });

  context('should work on a promise that resolves to an array-like object', () => {
    const arrLike = Promise.resolve({0: 1, 1: 2, 2: 4, length: 3});
    it('and return the first index of the specified element', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(1)).to.equal(0);
    });
    it('and return -1 if the array doesn\'t include the specified element', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(5)).to.equal(-1);
    });
    it('and work with fromIndex specified', async () => {
      expect(await AsyncAF(arrLike).indexOfAF(1, 1)).to.equal(-1);
      expect(await AsyncAF(arrLike).indexOfAF(2, 1)).to.equal(1);
      expect(await AsyncAF(arrLike).indexOfAF(2, -100)).to.equal(1);
      expect(await AsyncAF(arrLike).indexOfAF(2, 100)).to.equal(-1);
    });
  });

  it('should reject with TypeError when called on non-compatible objects', async () => {
    await expect(AsyncAF(null).indexOfAF(2)).to.eventually.be.rejected.and.has.property(
      'message',
      'indexOfAF cannot be called on null, only on an Array, String, or array-like Object',
    );
    await expect(AsyncAF().indexOfAF(2)).to.eventually.be.rejected.and.has.property(
      'message',
      'indexOfAF cannot be called on undefined, only on an Array, String, or array-like Object',
    );
    await expect(AsyncAF({}).indexOfAF(2)).to.eventually.be.rejected.and.has.property(
      'message',
      'indexOfAF cannot be called on [object Object], only on an Array, String, or array-like Object',
    );
    await expect(AsyncAF(() => {}).indexOfAF(2))
      .to.eventually.be.rejected.and.has.property(
        'message',
        'indexOfAF cannot be called on function () {}, only on an Array, String, or array-like Object',
      );
    await expect(AsyncAF(true).indexOfAF(2)).to.eventually.be.rejected.and.has.property(
      'message',
      'indexOfAF cannot be called on true, only on an Array, String, or array-like Object',
    );
  });
});