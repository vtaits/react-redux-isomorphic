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
              firefox: '90',
              chrome: '91',
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

      plugins: [
        '@loadable/babel-plugin',
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
      version: '7.12.5',
    }],

    '@babel/plugin-proposal-class-properties',
  ],
};
