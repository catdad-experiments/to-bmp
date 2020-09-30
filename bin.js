#!/usr/bin/env node

const fetch = require('node-fetch');

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
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`failed to fetch "${url}": ${res.status} ${res.statusText}`);
  }

  return await res.buffer();
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
