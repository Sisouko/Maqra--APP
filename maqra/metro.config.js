const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude Docker and other system socket/pipe paths that Metro's
// FallbackWatcher cannot lstat, causing an EACCES crash on Windows.
const { blockList } = config.resolver;
const blockListRE = blockList ? (Array.isArray(blockList) ? blockList : [blockList]) : [];

config.resolver.blockList = [
  ...blockListRE,
  // Docker secrets engine socket
  /.*docker-secrets-engine.*/,
  // Broad guard: any .sock file under AppData
  /.*AppData[\\\/]Local[\\\/].*\.sock$/,
];

module.exports = config;
