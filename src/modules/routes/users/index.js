/*
 * @description: 用户相关路由
 * @author: zpl
 * @Date: 2020-07-25 16:36:13
 * @LastEditTime: 2020-07-25 16:42:53
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  const UserModel = server.mysql.models.Users;
  // 获取所有用户信息
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
});
