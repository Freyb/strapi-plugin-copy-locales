'use strict';

const { ValidationError } = require('@strapi/utils').errors;

module.exports = {
  default: {
    contentTypes: [],
  },
  validator(config) {
    if (!config.contentTypes) {
      throw new ValidationError('You must define contentTypes prop');
    }
    if (!Array.isArray(config.contentTypes) && config.contentTypes !== '*') {
      throw new ValidationError("Must define contentTypes as an array or '*'");
    }
  },
};
