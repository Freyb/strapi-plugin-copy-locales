'use strict';

const { pluginId } = require('../../admin/src/pluginId');

module.exports = ({ strapi }) => {
  const defaultConfig = {
    contentTypes: [],
  };

  const getConfig = async () => {
    const config = strapi.config.get(`plugin.${pluginId}`, defaultConfig);
    return config;
  };

  return {
    getConfig,
  };
};
