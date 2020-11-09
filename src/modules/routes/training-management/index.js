/*
 * @description: 安全培训管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-24 15:11:30
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  // 根据ID获取培训信息
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
      console.log('-------------error------------');
      request.log.error(error);
      console.log('-------------error------------');
      return reply.send(400);
    }
  });

  // 获取所有培训信息
  server.get('/trainings', {}, async (request, reply) => {
    try {
      const trainingList = await server.db.models.Training.find({});

      if (!trainingList) {
        return reply.send(404);
      }

      return reply.code(200).send(trainingList);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });

  // 新增或更新培训
  server.post('/training', {}, async (request, reply) => {
    try {
      const {Training} = server.db.models;

      const training = await Training.create(request.body);

      return reply.code(201).send(training);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  next();
});