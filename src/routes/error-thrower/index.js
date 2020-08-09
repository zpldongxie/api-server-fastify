/*
 * @description: 异常响应路由
 * @author: zpl
 * @Date: 2020-07-23 11:50:38
 * @LastEditTime: 2020-07-30 14:45:00
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/api/error-thrower',
    method: ['GET'],
    handler: async (request, reply) => {
      throw new Error('Oh no, something bad happened, try to debug me');
      return reply.send({date: new Date(), works: true});
    },
  });
  next();
});
