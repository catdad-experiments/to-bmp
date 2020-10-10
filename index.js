const jpegJs = require('jpeg-js');
const pngJs = require('pngjs');
const Encoder = require('./lib/encoder.js');

function compare(a, b) {
  for (let i = 0; i < a.length; i++) {
    if ((a[i] !== b[i])) {
      return false;
    }
  }
  return true;
}

module.exports = async (buffer) => {
  if (!(buffer instanceof Uint8Array)) {
    throw new Error('the input data should be a Buffer or Uint8Array');
  }

  let decodedBuffer;

  if (compare(buffer.slice(0, 8), [0x89, 0x50, 0x4E, 0x47, 0xD, 0xA, 0x1A, 0xA])) { // PNG File Signature
    decodedBuffer = pngJs.PNG.sync.read(buffer);
  } else {
    decodedBuffer = jpegJs.decode(buffer);
  }

  const { width, height, data } = decodedBuffer;

  const agbr = new Uint8Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    agbr[i + 0] = data[i + 3];
    agbr[i + 1] = data[i + 2];
    agbr[i + 2] = data[i + 1];
    agbr[i + 3] = data[i + 0];
  }

  const encoder = new Encoder({ data: agbr, width, height });

  return encoder.data;
};
