#!/usr/bin/env node

const fetch = require('./lib/fetch-success.js');

const convert = require('./');

const url = process.argv[2];

const readStdin = async () => {
  const result = [];

  for await (const chunk of process.stdin) {
    result.push(chunk);
  }

  return Buffer.concat(result);
};

const download = async () => {
  const { body } = await fetch(url);
  return body;
};

(async () => {
  const input = url ? await download() : await readStdin();

  const output = await convert(input);

  process.stdout.write(output);
})().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
