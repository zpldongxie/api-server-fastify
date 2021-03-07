/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-03-07 15:26:23
 * @LastEditors: zpl
 */
const crypto = require('crypto');
const fp = require('fastify-plugin');
const Method = require('./method');
const { userStatus } = require('../../dictionary');
const { getCurrentDate } = require('../../util');

const routerBaseInfo = {
  modelName: 'User',
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
  const { ajv, config: { hmacKey } } = opts;
  const method = new Method(mysqlModel, routerBaseInfo.modelName, ajv);


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
        console.log('post: ' + routerBaseInfo.doLoginURL);
        const validate = ajv.compile(loginSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const { userName, pwd } = request.body;
        const password = crypto.createHmac('sha1', hmacKey).update(pwd).digest('hex');
        const res = await method.dbMethod.findOne({
          where: { loginName: userName, password },
          include: [{ model: mysqlModel.Department }],
        });
        const { status, data } = res;
        if (status) {
          console.log(data.loginName, ' 正在登录');
          const token = server.jwt.sign({ id: data.id });
          const authors = data.Departments.map((g) => g.tag);
          return reply.code(200).send({
            status: 'ok',
            currentAuthority: authors,
            token,
          });
        }
        return reply.code(200).send({ status: 'error', message: '用户名或密码错误' });
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
        console.log(`${getCurrentDate()} -- get: ${routerBaseInfo.getCurrentUserURL}`);
        const res = await method.dbMethod.findOne({
          where: { id: request.user.id, status: userStatus.enabled },
          exclude: ['password', 'verification_code', 'status'],
        });
        const { status, data } = res;
        if (status) {
          const token = server.jwt.sign({ id: data.id });
          return reply.code(200).send({
            data,
            token,
          });
        } else {
          return reply.code(200).send('查询失败');
        }
      },
  );

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      { schema: { ...getByIdSchema, tags: ['user'], summary: '根据ID获取单个用户' } },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['user'], summary: '获取所有用户' } },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['user'], summary: '根据条件获取用户列表' } },
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
