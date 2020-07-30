/*
 * @description: 安全培训管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-30 14:46:20
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {onRouteError} = require('../util');

module.exports = fp(async (server, opts, next) => {
  const {Training, Channel} = server.mysql.models;
  const {ajv} = opts;
  server.get('/api/training/:id', {}, async (request, reply) => {
    try {
      const id = request.params.id;
      const training = await Training.findOne({where: {id}});
      if (!training) {
        return reply.send(404);
      }
      return reply.code(200).send(training);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取所有培训信息
  server.get('/api/trainings', {}, async (request, reply) => {
    try {
      const trainingList = await Training.findAll({include: Channel});
      if (!trainingList) {
        return reply.send(404);
      }
      return reply.code(200).send(trainingList);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put('/api/training', {updateSchema}, async (request, reply) => {
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    // const data = {
    //   "title": "testTitle6",
    //   "subTitle": "",
    //   "registStartTime":"2020-01-01",
    //   "registEndTime": "2020-07-25",
    //   "trainingMethod": "线上公开",
    //   "startTime": "2020-07-25T16:34:06.157Z",
    //   "endTime": "2020-07-25T16:34:06.157Z",
    //   "desc": "好滴很！"
    //   "ChannelId": "1",
    // };
    if (!valid) {
      return reply.code(200).send(validate.errors);
    }
    try {
      const id = request.body.id;
      const channel = await Channel.findOne({where: {id: request.body.ChannelId}});
      if (id) {
        // 更新
        const training = await Training.findOne({id});
        if (training && channel) {
          if (channel) {
            training.title = request.body.title;
            training.subTitle = request.body.subTitle;
            training.registStartTime = request.body.registStartTime;
            training.registEndTime = request.body.registEndTime;
            training.trainingMethod = request.body.trainingMethod;
            training.startTime = request.body.startTime;
            training.endTime = request.body.endTime;
            training.desc = request.body.desc;
            training.setChannel(channel);
            await training.save();
            return reply.code(201).send(training);
          } else {
            reply.code(200).send({
              status: 'error',
              message: '指定栏目不存在，无法更新。',
            });
          }
        } else {
          reply.code(200).send({
            status: 'error',
            message: '培训记录不存在，无法更新。',
          });
        }
      } else {
        // 新增
        if (channel) {
          const training = await Training.create(request.body);
          if (training) {
            return reply.code(201).send(training);
          }
        } else {
          reply.code(200).send({
            status: 'error',
            message: '培训记录不存在，无法更新。',
          });
        }
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
