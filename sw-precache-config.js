module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/favicon.ico',
    'dist/js/**.js',
    'dist/wickeyappstore/**.*',
    'dist/assets/**.*',
    'dist/assets/**/**.*',
    'dist/**.css'
  ],
  runtimeCaching: [{
    urlPattern: /^https:\/\/api\.wickeyappstore\.com\//,
    handler: 'networkFirst'
  }, {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\/cdn\.onesignal\.com\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\/unpkg\.com\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\/code\.jquery\.com\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\/cdn\.jsdelivr\.net\//,
    handler: 'cacheFirst'
  }],
};
