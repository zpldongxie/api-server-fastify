/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-03-23 21:27:23
 * @LastEditors: zpl
 */
const crypto = require('crypto');
const fp = require('fastify-plugin');
const Method = require('./method');
const { userStatus } = require('../../dictionary');
const { getCurrentDate } = require('../../util');

const routerBaseInfo = {
  modelName: 'User',
  doLoginURL: '/api/doLogin', // 登录
  getCurrentUserURL: '/api/currentUser', // 获取当前登录的用户信息
  getURL: '/api/user/:id', // 根据ID获取信息
  getListURL: '/api/getUserList', // 按条件查询
  getXmglyList: '/api/getXmgly', // 获取项目管理员列表
  getShyList: '/api/getShy', // 获取当前登录用户对应的审核员列表
  getPdjdyList: '/api/getPdjdyList', // 获取当前登录用户可选的评定决定员列表
  putURL: '/api/user', // 新增用户
  deleteURL: '/api/users', // 删除用户
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

        const { userName, pwd, type } = request.body;
        const password = crypto.createHmac('sha1', hmacKey).update(pwd).digest('hex');
        const res = await method.dbMethod.findOne({
          where: { loginName: userName, password },
          include: [{
            model: mysqlModel.Department,
            include: [{
              model: mysqlModel.DepTag,
            }],
          }],
        });
        const { status, data } = res;
        if (!status) {
          return reply.code(200).send({ status: 'error', message: '用户名或密码错误' });
        }
        const currentType = data.Departments[0].DepTag.name;
        if (currentType !== type && !(currentType === 'admin' && 'wal' === type)) {
          // admin只能通过网安联入口进入
          return reply.code(200).send({ status: 'error', message: '账号类型不正确' });
        }
        console.log(data.loginName, ' 正在登录');
        const token = server.jwt.sign({ id: data.id });
        const authors = data.Departments.map((g) => {
          return g.DepTag.name;
        });
        return reply.code(200).send({
          status: 'ok',
          currentAuthority: authors,
          token,
        });
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
          include: [{
            model: mysqlModel.Department,
            include: [{
              model: mysqlModel.DepTag,
            }],
          }],
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

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['user'], summary: '根据条件获取用户列表' } },
      (request, reply) => method.queryList(request, reply),
  );

  const getXmglyListSchema = require('./get-xmgly-list-schema');
  server.post(
      routerBaseInfo.getXmglyList,
      {
        preValidation: [server.authenticate],
        schema: { ...getXmglyListSchema, tags: ['user'], summary: '获取项目管理员列表' },
      },
      (request, reply) => method.getXmglyList(request, reply),
  );

  server.get(
      routerBaseInfo.getShyList,
      {
        preValidation: [server.authenticate],
        schema: { tags: ['user'], summary: '获取当前登录用户对应的审核员列表' },
      },
      (request, reply) => method.getShyList(request, reply),
  );

  server.get(
      routerBaseInfo.getPdjdyList,
      {
        preValidation: [server.authenticate],
        schema: { tags: ['user'], summary: '获取当前登录用户可选的评定决定员列表' },
      },
      (request, reply) => method.getPdjdyList(request, reply),
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
