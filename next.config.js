module.exports = {
  env: {
    CREATOR_ADDRESS: process.env.CREATOR_ADDRESS,
  },
  webpack: (config, { isServer }) => {
    // Note: This is required to use the Zora ZDK on the client
    if (!isServer) config.node = { fs: 'empty' };
    return config;
  },
};
