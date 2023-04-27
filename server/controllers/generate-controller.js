'use strict';
const pluginId = require('../../admin/src/pluginId').pluginId;

module.exports = ({ strapi }) => {
  const generateService = strapi.plugin(pluginId).service('generateService');

  const generate = async (ctx) => {
    const { body } = ctx.request;
    ctx.body = await generateService.generate(body);
  };

  return {
    generate,
  };
};
