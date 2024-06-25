const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/mapbox',
    createProxyMiddleware({
      target: 'https://api.mapbox.com',
      changeOrigin: true,
      pathRewrite: {
        '^/mapbox': '', // remove /mapbox prefix when sending request
      },
    })
  );
};
