/* eslint-disable no-console */

const argv = process.argv.slice(2);
const pkg = require('../package.json');

if (argv.includes('--version') || argv.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`to-bmp v${pkg.version}

Examples:
to-bmp < input.jpg > output.bmp
to-bmp http://example.com/input.png > output.bmp
`);

  process.exit(0);
}
