/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2020-07-30 15:42:59
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {queryByCid, queryAll} = require('../content/query-content-method');
const {onRouteError} = require('../util');

const querySchema = require('./query-content-list-schema');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const {ajv} = opts;

  // 按条件获取发布的文章
  server.post('/getPubList', {querySchema}, async (req, reply) => {
    const validate = ajv.compile(querySchema.body.valueOf());
    const valid = validate(req.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const {
        channelId,
        current = 1,
        pageSize = 10,
      } = req.body;
      const result = await queryByCid({
        mysqlModel,
        channelId,
        search: {pubStatus: '已发布'},
        pageSize,
        current,
      });
      return reply.code(200).send(result);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  server.get('/recomList', {}, async (req, reply) => {
    try {
      const result = await queryAll({mysqlModel, search: {pubStatus: '已发布', isRecom: true}});
      return reply.code(200).send(result);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
