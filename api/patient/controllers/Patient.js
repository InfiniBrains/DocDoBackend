'use strict';

/**
 * Patient.js controller
 *
 * @description: A set of functions called "actions" for managing `Patient`.
 */

module.exports = {

  /**
   * Retrieve patient records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.patient.search(ctx.query);
    } else {
      return strapi.services.patient.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a patient record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.patient.fetch(ctx.params);
  },

  /**
   * Count patient records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.patient.count(ctx.query);
  },

  /**
   * Create a/an patient record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.patient.add(ctx.request.body);
  },

  /**
   * Update a/an patient record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.patient.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an patient record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.patient.remove(ctx.params);
  }
};
