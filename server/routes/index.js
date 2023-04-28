module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: 'generateController.generate',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/getlocalizations',
    handler: 'generateController.getLocalizations',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'configController.getConfig',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
