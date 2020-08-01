/*
 * @description: 用户相关路由
 * @author: zpl
 * @Date: 2020-07-25 16:36:13
 * @LastEditTime: 2020-08-01 13:45:32
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {onRouteError} = require('../util');

module.exports = fp(async (server, opts, next) => {
  const {User, UserGroup} = server.mysql.models;
  const {ajv} = opts;

  // 登录
  const loginSchema = require('./login-schema');
  server.post('/api/doLogin', {loginSchema}, async (request, reply) => {
    const validate = ajv.compile(loginSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const {userName, pwd} = request.body;
    try {
      const user = await User.findOne({
        where: {loginName: userName, password: pwd},
        include: UserGroup,
      });
      if (user) {
        const token = server.jwt.sign({id: user.id});
        const authors = user.UserGroups.map((g) => g.tag);
        return reply.code(200).send({
          status: 'ok',
          currentAuthority: authors,
          token: token,
        });
      }
      return reply.code(200).send({status: 'error'});
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取所有用户信息
  // GET http://49.234.158.74:3000/users
  server.get('/api/users', {}, async (request, reply) => {
    try {
      const userList = await User.findAll({
        include: [{
          model: UserGroup,
          through: {
            attributes: [],
          },
        }],
      });

      if (!userList) {
        return reply.send(404);
      }
      return reply.code(200).send(userList);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取当前用户，暂时返回固定内容
  server.get('/api/currentUser',
      {preValidation: [server.authenticate]},
      async (request, reply) => {
        console.log(request.user);
        const user = await User.findOne({
          where: {id: request.user.id, status: 1},
          exclude: ['password', 'verification_code', 'status'],
        });
        return reply.code(200).send(user);
      });

  server.put('/api/user', {}, async (request, reply) => {

  });

  next();
});
