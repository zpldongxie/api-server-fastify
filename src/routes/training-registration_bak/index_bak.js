/*
 * @description: 安全培训报名相关路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-06 21:28:14
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { findOne } = require('../../modules/mysql/dao');
const { onRouteError, commonCatch, CommonMethod } = require('../util');


module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { TrainingReg, Training, Channel } = mysqlModel;
  const { ajv } = opts;
  const routerMethod = new CommonMethod(TrainingReg);

  // 根据ID获取单个
  server.get('/api/trainingReg/:id', {}, async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      routerMethod.findOne(reply, id);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 获取所有培训信息
  server.get('/api/trainingRegs', {}, async (request, reply) => {
    const runFun = async () => {
      const conditions = {
        include: {
          model: Training,
          attributes: ['id', 'title'],
        },
      };
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 根据条件获取培训信息列表
  const queryListSchema = require('./query-list-schema');
  server.post('/api/getTrainingRegList', { schema: queryListSchema }, async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const {
        current,
        pageSize,
        sorter,
        filter,
        ...where
      } = request.body;
      const include = {
        model: Training,
        attributes: ['id', 'title'],
        include: {
          model: Channel,
          attributes: ['id', 'name'],
        },
      };
      routerMethod.queryList(reply, where, current, pageSize, sorter, filter, include);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put('/api/trainingReg', { schema: updateSchema }, async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const training = await findOne(Training, { id: request.body.TrainingId });
      if (training) {
        await routerMethod.upsert(reply, request.body);
      } else {
        onRouteError(reply, {
          status: 422,
          message: '指定培训不存在。',
        });
      }
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 删除报名
  const deleteSchema = require('./delete-schema');
  server.delete('/api/trainingRegs', { schema: deleteSchema }, async (request, reply) => {
    const validate = ajv.compile(deleteSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const ids = request.body.ids;
      await routerMethod.delete(ids);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 设置审批状态
  const setPassedSchema = require('./set-passed-schema');
  server.post('/api/trainingRegs/setPassed', { setPassedSchema }, async (request, reply) => {
    const validate = ajv.compile(setPassedSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const { ids, passed } = request.body;
      await routerMethod.updateMany({ ids, updateInfo: { passed } });
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  next();
});
