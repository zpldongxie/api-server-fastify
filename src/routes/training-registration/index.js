/*
 * @description: 安全培训报名相关路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-08-09 16:16:44
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { findAll, findOne, findSome, create, updateOne, updateMany, deleteSome } = require('../../modules/mysql/dao');
const { onRouteError } = require('../util');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { TrainingReg, Training, Channel } = mysqlModel;
  const { ajv } = opts;

  // 根据ID获取单个
  server.get('/api/trainingReg/:id', {}, async (request, reply) => {
    const id = request.params.id;
    const result = await findOne(TrainingReg)({ id });
    return reply.code(200).send(result);
  });

  // 获取所有培训信息
  server.get('/api/trainingRegs', {}, async (request, reply) => {
    const result = await findAll(TrainingReg)({
      include: {
        model: Training,
        attributes: ['id', 'title'],
      },
    });
    return reply.code(200).send(result.data);
  });

  // 根据条件获取培训信息列表
  const queryListSchema = require('./query-list-schema');
  server.post('/api/getTrainingRegList', { schema: queryListSchema }, async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const {
      TrainingId,
      name,
      mobile,
      email,
      comp,
      passed,
      current = 1,
      pageSize = 20,
      sorter,
    } = request.body;
    const queryParams = {
      where: {},
      pageSize,
      current,
      include: {
        model: Training,
        attributes: ['id', 'title'],
        include: {
          model: Channel,
          attributes: ['id', 'name'],
        },
      },
    };
    if (sorter && Object.keys(sorter).length) {
      const orderName = Object.keys(sorter)[0];
      const orderValue = sorter[orderName].includes('asc') ? 'ASC' : 'DESC';
      queryParams.order = [[orderName, orderValue]];
    }
    if (TrainingId) {
      queryParams.where.TrainingId = TrainingId;
    }
    if (name) {
      queryParams.where.name = name;
    }
    if (mobile) {
      queryParams.where.mobile = mobile;
    }
    if (email) {
      queryParams.where.email = email;
    }
    if (comp) {
      queryParams.where.comp = comp;
    }
    if (typeof passed !== 'undefined') {
      queryParams.where.passed = passed;
    }

    const result = await findSome(TrainingReg)(queryParams);
    return reply.code(200).send(result);
  });

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put('/api/trainingReg', { schema: updateSchema }, async (request, reply) => {
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const id = request.body.id;
      const training = await findOne(Training)( { id: request.body.TrainingId } );
      // const training = await Training.findOne({ where: { id: request.body.TrainingId } });
      if (id) {
        // 更新
        const trainingReg = await TrainingReg.findOne({ id });
        if (trainingReg) {
          if (training) {
            const result = await updateOne(TrainingReg)({ id, updateInfo: request.body });
            if (result.status) {
              return reply.code(201).send(result);
            }
            return reply.code(422).send(result);
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
          const trainingReg = await create(TrainingReg)(request.body);
          if (trainingReg.status) {
            return reply.code(201).send(trainingReg.data);
          }
          return reply.code(422).send(result);
        } else {
          reply.code(200).send({
            status: '0',
            message: '指定培训不存在，无法创建报名。',
          });
        }
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 删除报名
  server.delete('/api/trainingRegs', {}, async (request, reply) => {
    try {
      const ids = request.body.ids;
      if (!ids || !Array.isArray(ids)) {
        reply.code(400).send({
          status: 'error',
          message: '培训报名ID无效。',
        });
        return;
      }

      await deleteSome(TrainingReg)(ids);
      reply.code(204);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 设置审批状态
  const setPassedSchema = require('./set-passed-schema');
  server.post('/api/trainingRegs/setPassed', { setPassedSchema }, async (request, reply) => {
    const validate = ajv.compile(setPassedSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    try {
      const { ids, passed } = request.body;
      await updateMany(TrainingReg)({ ids, updateInfo: { passed } });
      return reply.code(200).send({ message: '设置完成' });
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
