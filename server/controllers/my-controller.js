'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('content-auto-create')
      .service('myService')
      .getWelcomeMessage();
  },
});
