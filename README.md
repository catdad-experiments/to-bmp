# @catdad/to-bmp

[![Build Status][travis.svg]][travis.link] [![NPM Downloads][npm-downloads.svg]][npm.link] [![NPM Version][npm-version.svg]][npm.link]

[travis.svg]: https://travis-ci.com/catdad-experiments/to-bmp.svg?branch=master
[travis.link]: https://travis-ci.com/catdad-experiments/to-bmp
[npm-downloads.svg]: https://img.shields.io/npm/dm/@catdad/to-bmp.svg
[npm.link]: https://www.npmjs.com/package/@catdad/to-bmp
[npm-version.svg]: https://img.shields.io/npm/v/@catdad/to-bmp.svg

> Convert JPG or PNG images to BMP

This module was specifically created to generate BMP images that are compatible with NSIS in order to create [splash images for Electron portable applications](https://github.com/electron-userland/electron-builder/issues/2548), when I discovered that various popular encoders did not produce images that could be used within NSIS. The encoder in this module is based on [`@wokwi/bmp-ts`](https://github.com/wokwi/bmp-ts).

## Install

```bash
npm install @catdad/to-bmp
```

## API

```javascript
const { promises: fs } = require('fs');
const toBmp = require('@catdad/to-bmp');

(async () => {
  const jpeg = await fs.readFile('./path/to/my.jpg');
  const output = await toBmp(jpeg);

  await fs.writeFile('./path/to/my.bmp', output);
})();
```

## CLI

Convert a local image (JPG or PNG) to BMP:

```bash
npx @catdad/to-bmp < input.jpg > output.bmp
```

Convert an image (JPG or PNG) from a url to BMP:

```bash
npx @catdad/to-bmp https://example.com/input.png > output.bmp
```

You can use these to generate the splash image for your Electorn app directly in a `postinstall` or `prepackage` script.

## Related

* [`@wokwi/bmp-ts`](https://github.com/wokwi/bmp-ts) - the original code that the encoder here is based on
