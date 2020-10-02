/* eslint-env mocha */
const crypto = require('crypto');
const { spawn } = require('child_process');

const { expect } = require('chai');
const isBmp = require('is-bmp');
const safe = require('safe-await');
const eos = require('end-of-stream');
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

  describe('cli', () => {
    const exec = async (args, options = {}, input = Buffer.from('')) => {
      return await Promise.resolve().then(async () => {
        const proc = spawn(process.execPath, ['bin'].concat(args), Object.assign({}, options, {
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: __dirname,
          windowsHide: true,
          env: {
            ...process.env,
            NODE_NO_WARNINGS: 1
          }
        }));

        const stdout = [];
        const stderr = [];

        proc.stdout.on('data', chunk => stdout.push(chunk));
        proc.stderr.on('data', chunk => stderr.push(chunk));

        proc.stdin.end(input);

        const [code] = await Promise.all([
          new Promise(resolve => proc.on('exit', code => resolve(code))),
          new Promise(resolve => eos(proc.stdout, () => resolve())),
          new Promise(resolve => eos(proc.stderr, () => resolve())),
        ]);

        return {
          err: { code },
          stdout: Buffer.concat(stdout),
          stderr: Buffer.concat(stderr)
        };
      });
    };

    it('converts an image piped in through stdin, outputting the result to stdout', async () => {
      const { stdout, stderr, err } = await exec([], {}, data);

      expect(isBmp(stdout)).to.equal(true);
      expect(hash(stdout)).to.equal(HASH);

      expect(stderr.toString()).to.equal('');
      expect(err).to.deep.equal({ code: 0 });
    });

    it('converts an image provided by a url, outputting the result to stdout', async () => {
      const { stdout, stderr, err } = await exec([URL], {});

      expect(isBmp(stdout)).to.equal(true);
      expect(hash(stdout)).to.equal(HASH);

      expect(stderr.toString()).to.equal('');
      expect(err).to.deep.equal({ code: 0 });
    });

    it('exits with an error if data other than a jpeg piped into stdin', async () => {
      const { stdout, stderr, err } = await exec([], {}, Buffer.from('I am some text'));

      expect(stdout.toString()).to.equal('');
      expect(stderr.toString()).to.include('Error:');
      expect(err).to.deep.equal({ code: 1 });
    });
  });
});
