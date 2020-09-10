/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-10 17:51:59
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { commonCatch, CommonMethod } = require('../util');

const routerBaseInfo = {
  modelName_U: 'User',
  modelName_L: 'user',
  doLoginURL: '/api/doLogin',
  getCurrentUserURL: '/api/currentUser',
  getURL: '/api/user/:id',
  getAllURL: '/api/users',
  getListURL: '/api/getUserList',
  putURL: '/api/user',
  deleteURL: '/api/users',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { UserGroup } = mysqlModel;
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);

  // 登录
  const loginSchema = require('../user/login-schema');
  server.post(
      routerBaseInfo.doLoginURL,
      { schema: { ...loginSchema, tags: ['user'] } },
      async (request, reply) => {
        const validate = ajv.compile(loginSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const { userName, pwd } = request.body;
        const runFun = async () => {
          const user = await CurrentModel.findOne({
            where: { loginName: userName, password: pwd },
            include: UserGroup,
          });
          if (user) {
            const token = server.jwt.sign({ id: user.id });
            const authors = user.UserGroups.map((g) => g.tag);
            return reply.code(200).send({
              status: 'ok',
              currentAuthority: authors,
              token: token,
            });
          }
          return reply.code(200).send({ status: 'error' });
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 根据ID获取单个
  server.get(routerBaseInfo.getURL, { schema: { tags: ['user'] } }, async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      routerMethod.findOne(reply, id);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 获取所有用户信息
  server.get(routerBaseInfo.getAllURL, { schema: { tags: ['user'] } }, async (request, reply) => {
    const runFun = async () => {
      const conditions = {};
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 根据条件获取用户信息列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['user'] } },
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

  // 获取当前用户
  server.get(
      routerBaseInfo.getCurrentUserURL,
      {
        preValidation: [server.authenticate],
        schema: { tags: ['user'] },
      },
      async (request, reply) => {
        const user = await CurrentModel.findOne({
          where: { id: request.user.id, status: 1 },
          exclude: ['password', 'verification_code', 'status'],
        });
        return reply.code(200).send(user);
      });

  // 新增或更新用户
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['user'] } },
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
      { schema: { deleteSchema, tags: ['user'] } },
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
