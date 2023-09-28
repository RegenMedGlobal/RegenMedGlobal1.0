const webpack = require('webpack');


module.exports = function override(config, env) {
  module: {
    rules: [
        {
            test: /\bmapbox-gl-csp-worker.js\b/i,
            use: { loader: 'worker-loader' }
        }
    ]
}

  
console.log('Custom Webpack configuration is being used.');

  config.resolve.fallback = {
    dns: false,
    tls: false,
    url: require.resolve('url/'),
    https: require.resolve('https-browserify'),
    net: false,
    stream: require.resolve('stream-browserify'),
    os: require.resolve('os-browserify/browser'),
    assert: require.resolve('assert/'),
    crypto: require.resolve('crypto-browserify'),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};

