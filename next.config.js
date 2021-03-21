module.exports = {
  webpack: (config, { isServer }) => {
    // Note: This is required to use the Zora ZDK on the client
    if (!isServer) config.node = { fs: 'empty' };
    return config;
  },
};
