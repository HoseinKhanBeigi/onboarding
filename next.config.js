const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const lessThemeVariablesFilePath = './static/ant-theme-variables.less';

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, lessThemeVariablesFilePath), 'utf8'),
);
console.log(process.env.FLOW_SERVER_ADDRESS, 'process.env.FLOW_SERVER_ADDRESS');

const nextConfig = {
  publicRuntimeConfig: {
    flowBaseUrl:
      process.env.FLOW_SERVER_ADDRESS || 'https://uat.kian.digital/onboarding',
    baseUrl: process.env.SERVER_ADDRESS || 'https://uat.kian.digital',
    configBaseUrl:
      process.env.CONFIG_ADDRESS ||
      'https://onboarding-web-backend.uat.kian.digital/api',
    fileBaseUrl:
      process.env.FILE_SERVER_ADDRESS ||
      'https://uat.kian.digital/glusterproxy/api',
    environment: process.env.ENVIRONMENT_INDICATOR,
    analyticId: process.env.ANALYTIC_ID,
    sentryDsn: process.env.SENTRY_DSN,
    videoSize: {
      width: process.env.VIDEO_WIDTH_SIZE || 1080,
      height: process.env.VIDEO_HEIGHT_SIZE || 720,
      frameRate: process.env.VIDEO_FRAME_RATE || 24,
    },
    auth: {
      clientId: process.env.AUTH_CLIENT_ID || 'onboarding-web',
      baseUrl:
        process.env.AUTH_BASEURL ||
        'https://uat.neshanid.com/auth/realms/KIAN/protocol/openid-connect',
      apiBaseUrl:
        process.env.AUTH_API_BASEURL ||
        'https://new.uat.neshanid.com/auth/realms/KIAN/api',
    },
  },
};

const lessNextConfig = {
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        // eslint-disable-line
        (context, request, callback) => {
          // eslint-disable-line
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      });
    }
    return config;
  },
};
const sassNextConfig = {
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: '[path]___[local]___[hash:base64:5]',
  },
};

module.exports = withPlugins(
  [
    [withLess, lessNextConfig],
    [withSass, sassNextConfig],
  ],
  nextConfig,
);
