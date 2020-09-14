/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-14 22:06:56
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { commonCatch, CommonMethod } = require('../util');

const routerBaseInfo = {
  modelName_U: 'TrainingReg',
  modelName_L: 'trainingreg',
  getURL: '/api/trainingreg/:id',
  getAllURL: '/api/trainingregs',
  getListURL: '/api/getTrainingRegList',
  putURL: '/api/trainingreg',
  deleteURL: '/api/trainingregs',
  setPassedURL: '/api/trainingRegs/setPassed',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { Channel, Training } = mysqlModel;
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      { ...getByIdSchema, schema: { tags: ['trainingreg'] } },
      async (request, reply) => {
        const runFun = async () => {
          const id = request.params.id;
          routerMethod.findOne(reply, id);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 获取所有培训信息
  server.get(routerBaseInfo.getAllURL, { schema: { tags: ['trainingreg'] } }, async (request, reply) => {
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
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['trainingreg'] },
      },
      async (request, reply) => {
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
          if (!sorter.hasOwnProperty('createdAt')) {
            sorter.createdAt = 'desc';
          }
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
      },
  );

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put(
      routerBaseInfo.putURL,
      {
        schema: { ...updateSchema, tags: ['trainingreg'] },
      },
      async (request, reply) => {
      // 参数校验
        const validate = ajv.compile(updateSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        // 执行方法
        const runFun = async () => {
          await routerMethod.upsert(reply, request.body);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 删除报名
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      {
        schema: { ...deleteSchema, tags: ['trainingreg'] },
      },
      async (request, reply) => {
        const validate = ajv.compile(deleteSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const runFun = async () => {
          const ids = request.body.ids;
          await routerMethod.delete(reply, ids);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 设置审批状态
  const setPassedSchema = require('./set-passed-schema');
  server.post(
      routerBaseInfo.setPassedURL,
      { schema: { ...setPassedSchema, tags: ['trainingreg'] } },
      async (request, reply) => {
        const validate = ajv.compile(setPassedSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const runFun = async () => {
          const { ids, passed } = request.body;
          await routerMethod.updateMany(reply, ids, { passed });
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  next();
});
