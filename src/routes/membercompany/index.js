/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-07 19:00:15
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { commonCatch, CommonMethod } = require('../util');

const routerBaseInfo = {
  modelName_U: 'MemberCompany',
  modelName_L: 'membercompany',
  getURL: '/api/membercompany/:id',
  getAllURL: '/api/membercompanys',
  getListURL: '/api/getMemberCompanyList',
  putURL: '/api/membercompany',
  deleteURL: '/api/membercompanys',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);

  // 根据ID获取单个
  server.get(routerBaseInfo.getURL, { schema: { tags: ['membercompany'] } }, async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      routerMethod.findOne(reply, id);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 获取所有培训信息
  server.get(routerBaseInfo.getAllURL, { schema: { tags: ['membercompany'] } }, async (request, reply) => {
    const runFun = async () => {
      const conditions = {};
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 根据条件获取培训信息列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['membercompany'] } },
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
          const include = {};
          routerMethod.queryList(reply, where, current, pageSize, sorter, filter, include);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 新增或更新培训
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['membercompany'] } },
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
      });

  // 删除报名
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { deleteSchema, tags: ['membercompany'] } },
      async (request, reply) => {
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

  next();
});
