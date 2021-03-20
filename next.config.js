module.exports = {
  webpack: config => {
    // This is required to use `Zora`
    config.node = { fs: 'empty' };

    return config;
  },
};
