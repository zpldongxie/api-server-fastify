/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-19 17:49:38
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { commonCatch, CommonMethod } = require('../util');

const routerBaseInfo = {
  modelName_U: 'Channel',
  modelName_L: 'channel',
  getURL: '/api/channel/:id',
  getAllURL: '/api/channels',
  getOnFilterURL: '/api/channels/:filter',
  getListURL: '/api/getChannelList',
  putURL: '/api/channel',
  deleteURL: '/api/channels',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      { schema: { ...getByIdSchema, tags: ['channel'], summary: '根据ID获取单个栏目' } },
      async (request, reply) => {
        const runFun = async () => {
          const id = request.params.id;
          routerMethod.findOne(reply, id);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 简单关键字过滤查找
  const keywordFilterSchema = require('./keyword-filter-schema');
  server.get(
      routerBaseInfo.getOnFilterURL,
      { schema: { ...keywordFilterSchema, tags: ['channel'], summary: '简单关键字过滤查找栏目' } },
      async (request, reply) => {
        const runFun = async () => {
          const filter = request.params.filter;
          const conditions = {
            where: filter ? { keyWord: { [Op.substring]: filter } } : {},
            attributes: ['id', 'name', 'keyWord'],
          };
          routerMethod.findAll(reply, conditions);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['channel'], summary: '获取所有栏目' } },
      async (request, reply) => {
        const runFun = async () => {
          const conditions = {
            order: [['orderIndex', 'DESC']],
          };
          routerMethod.findAll(reply, conditions);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['channel'], summary: '根据条件获取栏目列表' } },
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

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(
      routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['channel'], summary: '新增或更新栏目' } },
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

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['channel'], summary: '批量删除栏目' } },
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

  next();
});
