const jpegJs = require('jpeg-js');
const Encoder = require('./lib/encoder.js');

module.exports = async (buffer) => {
  const { width, height, data } = jpegJs.decode(buffer);

  const agbr = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i = i + 4) {
    agbr[i + 0] = data[i + 3];
    agbr[i + 1] = data[i + 2];
    agbr[i + 2] = data[i + 1];
    agbr[i + 3] = data[i + 0];
  }

  const encoder = new Encoder({ data: agbr, width, height });
  encoder.encode;

  return encoder.data;
};
