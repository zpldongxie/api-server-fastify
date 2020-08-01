/*
 * @description: 认证配置
 * @author: zpl
 * @Date: 2020-08-01 09:44:04
 * @LastEditTime: 2020-08-01 13:01:40
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify, opts) {
  fastify.register(require('fastify-jwt-with-verify-token'), {
    secret: 'WW14dlp5NTZhSFZ3Wlc1bmJHbGhibWN1WTI0JTNE',
  });

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify(request.headers.token);
    } catch (err) {
      reply.send(err);
    }
  });
});
