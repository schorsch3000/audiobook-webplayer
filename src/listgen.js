const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
if (!argv._) {
  console.log('i take a single parameter: the directory to the documentroot');
  process.exit(1);
}
try {
  const root = fs.realpathSync(argv._);
  process.chdir(root);
} catch (e) {
  console.error('1Directory ' + argv._ + ' not readable');
  process.exit(1);
}

let dirs = {};
for (let mp3 of glob.sync('**/*.mp3')) {
  let dirname = path.dirname(mp3);
  let basename = path.basename(mp3);
  if (!dirs[dirname]) {
    dirs[dirname] = {};
    dirs[dirname].files = [];
    dirs[dirname].images = glob.sync(`${dirname}/*.jpg`);
  }
  dirs[dirname].files.push(basename);
}

Object.keys(dirs).map(dirname => {
  dirs[dirname].files.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
});
fs.writeJson('playlist.json', dirs);
