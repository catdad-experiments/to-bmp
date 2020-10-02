/* eslint-env mocha */
const crypto = require('crypto');
const { expect } = require('chai');
const isBmp = require('is-bmp');
const safe = require('safe-await');
const fetch = require('./lib/fetch-success.js');

const lib = (...args) => safe(require('./')(...args));

// maybe this should be a local image? meh
const URL = 'https://cdn.jsdelivr.net/gh/catdad-experiments/catdad-experiments-org@7cb300/fair-compare/logo-social.jpg';
const HASH = 'fc9eaae853ebb132c8a065b6d73f3b8f28ddbcfeb6a00d2312b70ac10f845e6b';

const hash = data => crypto.createHash('sha256').update(data).digest('hex');

describe('to-bmp', () => {
  let data;

  before(async () => {
    const { body } = await fetch(URL);
    data = body;
  });

  describe('api', () => {
    it('converts a jpeg to bmp', async () => {
      const [error, output] = await lib(data);

      expect(error).to.equal(undefined);
      expect(isBmp(output)).to.equal(true, 'output is not a bmp');
      expect(hash(output)).to.equal(HASH);
    });

    it('errors if input is not a jpeg', async () => {
      const [error, output] = await lib('I am a string');

      expect(error).to.be.instanceOf(Error)
        .and.to.have.property('message', 'the input data should be a Buffer or Uint8Array');
      expect(output).to.equal(undefined);
    });
  });
});
