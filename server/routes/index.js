module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: 'generateController.generate',
    config: {
      policies: [],
    },
  },
];
