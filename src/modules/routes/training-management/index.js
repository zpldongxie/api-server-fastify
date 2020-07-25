/*
 * @description: 安全培训管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-26 00:45:44
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  const {TrainingModel} = server.mysql.models;
  const {ajv} = opts;
  // TODO: 根据ID获取培训信息
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
      const trainingList = await TrainingModel.findAll();

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
  const updateSchema = require('./update-schema');
  server.post('/training', {updateSchema}, async (request, reply) => {
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    // const data = {
    //   "title": "testTitle6",
    //   "subTitle": "",
    //   "typeByChannel": "1",
    //   "registStartTime":"2020-01-01",
    //   "registEndTime": "2020-07-25",
    //   "trainingMethod": "线上公开",
    //   "startTime": "2020-07-25T16:34:06.157Z",
    //   "endTime": "2020-07-25T16:34:06.157Z",
    //   "desc": "好滴很！"
    // };
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const training = await TrainingModel.create(request.body);

      return reply.code(201).send(training);
    } catch (error) {
      const {errors} = error;
      if (errors && errors.length) {
        const {message} = errors[0];
        return reply.code(406).send(message);
      }
      return reply.code(500);
    }
  });

  next();
});
