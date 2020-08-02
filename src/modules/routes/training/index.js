/*
 * @description: 安全培训管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-08-02 11:01:16
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {queryAll, queryByCid} = require('./query-list-method');
const {onRouteError} = require('../util');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const {Training, Channel} = mysqlModel;
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
      const trainingList = await Training.findAll({
        include: {
          model: Channel,
          attributes: ['id', 'name'],
        },
      });
      if (!trainingList) {
        return reply.send(404);
      }
      return reply.code(200).send(trainingList);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 根据条件获取培训信息列表
  const queryListSchema = require('./query-list-schema');
  server.post('/api/getTrainingList', {queryListSchema}, async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const {
        channelId,
        search = {},
        current = 1,
        pageSize = 20,
      } = request.body;
      if (channelId) {
        const result = await queryByCid({
          mysqlModel,
          search,
          channelId,
          pageSize,
          current,
        });
        return reply.code(200).send(result);
      }
      const result = await queryAll({
        mysqlModel,
        search,
        orderName: '',
        orderValue: '',
        pageSize,
        current,
      });
      return reply.code(200).send(result);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put('/api/training', {updateSchema}, async (request, reply) => {
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(200).send(validate.errors);
    }
    try {
      const id = request.body.id;
      const channel = await Channel.findOne({where: {id: request.body.ChannelId}});
      if (id) {
        // 更新
        const training = await Training.findOne({id});
        if (training) {
          if (channel) {
            const titleChanged = training.title !== request.body.title;
            training.title == request.body.title || (training.title = request.body.title);
            training.subTitle = request.body.subTitle || '';
            training.registStartTime = request.body.registStartTime;
            training.registEndTime = request.body.registEndTime;
            training.trainingMethod = request.body.trainingMethod;
            training.startTime = request.body.startTime;
            training.endTime = request.body.endTime;
            training.desc = request.body.desc || '';
            training.setChannel(channel);
            titleChanged ?
              await training.save() :
              await training.save({
                fields: [
                  'subTitle',
                  'registStartTime',
                  'registEndTime',
                  'trainingMethod',
                  'startTime',
                  'endTime',
                  'desc',
                  'ChannelId',
                ],
              });
            return reply.code(201).send(training);
          } else {
            reply.code(400).send({
              status: 'error',
              message: '指定栏目不存在，无法更新。',
            });
          }
        } else {
          reply.code(400).send({
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

  server.delete('/api/training', {}, async (request, reply) => {
    try {
      const id = request.body.id;
      const training = await Training.findOne({where: {id}});
      if (training) {
        await training.destroy();
        reply.code(204);
      } else {
        reply.code(400).send({
          status: 'error',
          message: '培训ID无效，无法删除。',
        });
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
