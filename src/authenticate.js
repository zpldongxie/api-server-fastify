/*
 * @description: 认证配置
 * @author: zpl
 * @Date: 2020-08-01 09:44:04
 * @LastEditTime: 2021-02-04 10:02:54
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify, opts) {
  fastify.register(require('fastify-jwt'), {
    secret: 'WW14dlp5NTZhSFZ3Wlc1bmJHbGhibWN1WTI0JTNE',
    sign: {
      expiresIn: '2h',
    },
    verify: {
      maxAge: '2d',
      extractToken: (req) => {
        return req.headers.token;
      },
    },
  });

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      console.log('-------------------------------');
      console.log(err.message);
      console.log('-------------------------------');
      reply.send(err);
    }
  });
});
