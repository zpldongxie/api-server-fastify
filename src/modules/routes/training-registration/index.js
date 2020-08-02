/*
 * @description: 安全培训报名相关路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-08-02 15:49:22
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {queryAll, queryByTid} = require('./query-list-method');
const {onRouteError} = require('../util');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const {TrainingReg, Training} = mysqlModel;
  const {ajv} = opts;
  server.get('/api/trainingReg/:id', {}, async (request, reply) => {
    try {
      const id = request.params.id;
      const trainingReg = await TrainingReg.findOne({where: {id}});
      if (!trainingReg) {
        return reply.send(404);
      }
      return reply.code(200).send(trainingReg);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取所有培训信息
  server.get('/api/trainingRegs', {}, async (request, reply) => {
    try {
      const trainingRegList = await TrainingReg.findAll({
        include: {
          model: Training,
          attributes: ['id', 'title'],
        },
      });
      if (!trainingRegList) {
        return reply.send(404);
      }
      return reply.code(200).send(trainingRegList);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 根据条件获取培训信息列表
  const queryListSchema = require('./query-list-schema');
  server.post('/api/getTrainingRegList', {queryListSchema}, async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const {
        trainingId,
        search,
        current = 1,
        pageSize = 20,
      } = request.body;
      if (trainingId) {
        const result = await queryByTid({
          mysqlModel,
          search,
          trainingId,
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
  server.put('/api/trainingReg', {updateSchema}, async (request, reply) => {
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(200).send(validate.errors);
    }
    try {
      const id = request.body.id;
      const training = await Training.findOne({where: {id: request.body.TrainingId}});
      if (id) {
        // 更新
        const trainingReg = await TrainingReg.findOne({id});
        if (trainingReg) {
          if (training) {
            const mobileChanged = trainingReg.mobile !== request.body.mobile;
            trainingReg.name = request.body.name;
            trainingReg.mobile = request.body.mobile;
            trainingReg.email = request.body.email;
            trainingReg.comp = request.body.comp;
            trainingReg.signInTime = request.body.signInTime || '';
            trainingReg.setTraining(training);
            mobileChanged ?
              await trainingReg.save() :
              await trainingReg.save({
                fields: [
                  'name',
                  'email',
                  'comp',
                  'signInTime',
                  'TrainingId',
                ],
              });
            return reply.code(201).send(trainingReg);
          } else {
            reply.code(400).send({
              status: 'error',
              message: '指定培训不存在，无法更新。',
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
        if (training) {
          const trainingReg = await TrainingReg.create(request.body);
          if (trainingReg) {
            return reply.code(201).send(trainingReg);
          }
          return reply.code(422).send('培训报名创建失败。');
        } else {
          reply.code(200).send({
            status: 'error',
            message: '指定培训不存在，无法创建报名。',
          });
        }
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  server.delete('/api/trainingReg', {}, async (request, reply) => {
    try {
      const id = request.body.id;
      const trainingReg = await TrainingReg.findOne({where: {id}});
      if (trainingReg) {
        await trainingReg.destroy();
        reply.code(204);
      } else {
        reply.code(400).send({
          status: 'error',
          message: '培训报名ID无效，无法删除。',
        });
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
