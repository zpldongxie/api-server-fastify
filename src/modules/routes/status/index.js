/*
 * @description: 查询服务状态的路由
 * @author: zpl
 * @Date: 2020-07-23 11:48:00
 * @LastEditTime: 2020-07-23 11:49:01
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/status',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      return reply.send({date: new Date(), works: true});
    },
  });
  next();
});