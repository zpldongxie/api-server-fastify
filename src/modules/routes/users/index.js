/*
 * @description: 用户相关路由
 * @author: zpl
 * @Date: 2020-07-25 16:36:13
 * @LastEditTime: 2020-07-27 15:05:27
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  const {UserModel, UserGroupMode} = server.mysql.models;
  const {ajv} = opts;

  // 登录
  const loginSchema = require('./login-schema');
  server.post('/doLogin', {loginSchema}, async (request, reply) => {
    const validate = ajv.compile(loginSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const {userName, pwd} = request.body;
    try {
      const user = await UserModel.findOne({
        where: {loginName: userName, password: pwd},
        include: UserGroupMode,
      });
      if (user) {
        const groups = await user.getGroups();
        const authors = groups ? groups.map((g) => g.name) : [];
        return reply.code(200).send({
          status: 'ok',
          user: user,
          currentAuthority: authors,
        });
      }
      return reply.code(201).send(training);
    } catch (error) {
      const {errors} = error;
      if (errors && errors.length) {
        const {message} = errors[0];
        return reply.code(406).send(message);
      }
      return reply.code(500).send(error);
    }
  });

  // 获取所有用户信息
  // GET http://49.234.158.74:3000/users
  server.get('/users', {}, async (request, reply) => {
    try {
      const userList = await UserModel.findAll();

      if (!userList) {
        return reply.send(404);
      }

      return reply.code(200).send(userList);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });

  // 获取当前用户，暂时返回固定内容
  server.get('/currentUser', {}, async (request, reply) => {
    return reply.code(200).send({
      name: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'jia.yang@clouddeep.cn',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '管理员',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    });
  });

  server.post('/user', {}, async (request, reply) => {

  });

  next();
});
