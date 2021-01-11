/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-11 16:47:29
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { commonCatch, CommonMethod, onRouteError } = require('../util');

const routerBaseInfo = {
  modelName_U: 'MemberIndivic',
  modelName_L: 'memberindivic',
  getURL: '/api/memberindivic/:id',
  getAllURL: '/api/memberindivics',
  getListURL: '/api/getMemberIndivicList',
  putURL: '/api/memberindivic',
  deleteURL: '/api/memberindivics',
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
      { schema: { ...getByIdSchema, tags: ['memberindivic'], summary: '根据ID获取单个个人会员' } },
      async (request, reply) => {
        const runFun = async () => {
          const id = request.params.id;
          const include = [{
            model: mysqlModel.MemberType,
            attributes: ['id', 'name'],
          }];
          routerMethod.findOne(reply, id, include);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['memberindivic'], summary: '获取所有个人会员' } },
      async (request, reply) => {
        const runFun = async () => {
          const conditions = {};
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
      { schema: { ...queryListSchema, tags: ['memberindivic'], summary: '根据条件获取个人会员列表' } },
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
          const include = [{
            model: mysqlModel.MemberType,
            attributes: ['id', 'name'],
          }];
          routerMethod.queryList(reply, where, current, pageSize, sorter, filter, include);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['memberindivic'], summary: '新增或更新个人会员' } },
      async (request, reply) => {
      // 参数校验
        const validate = ajv.compile(updateSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        // 执行方法
        const runFun = async () => {
          const { id, idNumber, mobile } = request.body;
          if (id) {
            // 编辑
            const idNumberRes = await routerMethod.dao.findAll({
              where: { id: { [Op.not]: id }, idNumber },
            });
            if (idNumberRes.status && idNumberRes.data.length) {
              return onRouteError(reply, { status: 200, message: '证件号已经注册或正在申请' });
            }
            const mobileRes = await routerMethod.dao.findAll({
              where: { id: { [Op.not]: id }, mobile },
            });
            if (mobileRes.status && mobileRes.data.length) {
              return onRouteError(reply, { status: 200, message: '手机号已经注册或正在申请' });
            }
            await routerMethod.updateOne(reply, id, request.body);
          } else {
            const res = await routerMethod.dao.findAll({ where: { [Op.or]: [{ idNumber }, { mobile }] } });
            if (res.status && res.data.length) {
              return onRouteError(reply, { status: 200, message: '证件号或手机号已经提交过申请，请不要重复提交' });
            }
            // 新增
            await routerMethod.create(reply, request.body);
          }
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['memberindivic'], summary: '新增或更新个人会员' } },
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
