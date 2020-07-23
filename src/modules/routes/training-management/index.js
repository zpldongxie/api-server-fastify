/*
 * @description: 安全培训管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-23 11:45:51
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.get('/training/:id', {}, async (request, reply) => {
    try {
      const _id = request.params.id;

      const training = await server.db.models.Training.findOne({
        _id,
      });

      if (!training) {
        return reply.send(404);
      }

      return reply.code(200).send(training);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });
});
