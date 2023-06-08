'use strict';
const pluginId = require('../../admin/src/pluginId');

module.exports = ({ strapi }) => {
  const generateService = strapi.plugin(pluginId).service('generateService');

  const generate = async (ctx) => {
    const { body } = ctx.request;
    ctx.body = await generateService.generate(body);
  };
  const getLocalizations = async (ctx) => {
    const { query } = ctx.request;
    ctx.body = await generateService.getLocalizations(query.uid, query.id);
  };

  return {
    generate,
    getLocalizations,
  };
};
