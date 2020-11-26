module.exports = {
  env: {
    cjs: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',

        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    },

    es: {
      presets: [
        '@babel/preset-typescript',

        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],

        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    },

    dev: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            modules: false,

            targets: {
              firefox: '83',
              chrome: '87',
            },
          },
        ],

        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    },

    test: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',

        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    },
  },

  plugins: [
    // https://github.com/babel/babel/issues/10261
    ['@babel/plugin-transform-runtime', {
      version: require('@babel/helpers/package.json').version,
    }],

    '@babel/plugin-proposal-class-properties',
  ],
};
