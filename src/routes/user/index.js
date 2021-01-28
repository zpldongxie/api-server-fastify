/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-25 15:55:37
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

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
  const method = new Method(CurrentModel, ajv);


  /*
  *                        _oo0oo_
  *                       o8888888o
  *                       88" . "88
  *                       (| -_- |)
  *                       0\  =  /0
  *                     ___/`---'\___
  *                   .' \\|     |// '.
  *                  / \\|||  :  |||// \
  *                 / _||||| -:- |||||- \
  *                |   | \\\  - /// |   |
  *                | \_|  ''\---/''  |_/ |
  *                \  .-\__  '-'  ___/-. /
  *              ___'. .'  /--.--\  `. .'___
  *           ."" '<  `.___\_<|>_/___.' >' "".
  *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
  *          \  \ `_.   \_ __\ /__ _/   .-` /  /
  *      =====`-.____`.___ \_____/___.-`___.-'=====
  *                        `=---='
  *
  *
  *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  *
  *            佛祖保佑       永不宕机     永无BUG
  */

  // 登录
  const loginSchema = require('../user/login-schema');
  server.post(
      routerBaseInfo.doLoginURL,
      { schema: { ...loginSchema, tags: ['user'] }, summary: '登录' },
      async (request, reply) => {
        console.log('post' + routerBaseInfo.doLoginURL);
        const validate = ajv.compile(loginSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const { userName, pwd } = request.body;
        const res = await method.dbMethod.findOne({
          where: { loginName: userName, password: pwd },
          include: [{ model: UserGroup }],
        });
        const { status, data } = res;
        console.log(data.name, ' 正在登录');
        if (status) {
          const token = server.jwt.sign({ id: data.id });
          const authors = data.UserGroups.map((g) => g.tag);
          return reply.code(200).send({
            status: 'ok',
            currentAuthority: authors,
            token: token,
          });
        }
        return reply.code(200).send({ status: 'error' });
      },
  );

  // 获取当前登录用户
  server.get(
      routerBaseInfo.getCurrentUserURL,
      {
        preValidation: [server.authenticate],
        schema: { tags: ['user'], summary: '获取当前登录用户' },
      },
      async (request, reply) => {
        console.log('get ' + routerBaseInfo.getCurrentUserURL);
        const res = await method.dbMethod.findOne({
          where: { id: request.user.id, status: 1 },
          exclude: ['password', 'verification_code', 'status'],
        });
        const { status, data } = res;
        if (status) {
          return reply.code(200).send(data);
        } else {
          return reply.code(200).send('查询失败');
        }
      },
  );

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      {
        schema: { ...getByIdSchema, tags: ['user'], summary: '根据ID获取单个用户' },
        config: { UserGroupModule: UserGroup },
      },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['user'], summary: '获取所有用户' },
        config: { UserGroupModule: UserGroup },
      },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['user'], summary: '根据条件获取用户列表' },
        config: { UserGroupModule: UserGroup },
      },
      (request, reply) => method.queryList(request, reply),
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['user'], summary: '新增或更新用户' } },
      (request, reply) => method.upsert(request, reply),
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['user'], summary: '批量删除用户' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
