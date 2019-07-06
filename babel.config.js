module.exports = {
  env: {
    cjs: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    },

    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        '@babel/preset-react',
      ],
    },

    dev: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,

            targets: {
              firefox: '67',
              chrome: '74',
            },
          },
        ],
        '@babel/preset-react',
      ],
    },

    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    },
  },

  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
  ],
};
