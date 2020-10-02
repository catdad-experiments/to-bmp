# @catdad/to-bmp

> Convert JPG iamges to BMP

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

Convert a local jpeg to bmp:

```bash
npx @catdad/to-bmp < input.jpg > output.bmp
```

Convert a jpeg from a url to bmp:

```bash
npx @catdad/to-bmp https://example.com/input.jpg > output.bmp
```

You can use these to generate the splash image for your Electorn app directly in a `postinstall` or `prepackage` script.

## Related

* [`@wokwi/bmp-ts`](https://github.com/wokwi/bmp-ts) - the original code that the encoder here is based on
