'use strict';

const pluginId = require('../../admin/src/pluginId');

const defaultConfig = require('../config');

module.exports = ({ strapi }) => {
  const getConfig = async () => {
    const config = strapi.config.get(
      `plugin.${pluginId}`,
      defaultConfig.default,
    );
    return config;
  };

  return {
    getConfig,
  };
};
