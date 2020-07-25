/*
 * @description: 安全培训报名管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-23 22:41:22
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  // 根据ID获取培训信息
  server.get('/trainingReg/:id', {}, async (request, reply) => {
    try {
      const _id = request.params.id;

      const training = await server.db.models.TrainingReg.findOne({
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

  // 获取所有培训信息
  server.get('/trainingRegs', {}, async (request, reply) => {
    try {
      const trainingRegList = await server.db.models.TrainingReg.find({});

      if (!trainingRegList) {
        return reply.send(404);
      }

      return reply.code(200).send(trainingRegList);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });

  // 新增或更新培训
  server.post('/trainingReg', {}, async (request, reply) => {
    try {
      const {TrainingReg} = server.db.models;

      const training = await TrainingReg.create(request.body);

      return reply.code(201).send(training);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  next();
});
