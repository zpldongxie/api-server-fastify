/*
 * @description: 数据库工具
 * @author: zpl
 * @Date: 2021-01-31 20:06:21
 * @LastEditTime: 2021-02-22 14:50:31
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

module.exports = fp(async (server, opts, next) => {
  const { ajv } = opts;
  const mysqlModel = server.mysql.models;

  const method = new Method(mysqlModel, ajv);

  server.post(
      '/api/databaseutil/commonSettings/sync',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步公共配置数据' } },
      (request, reply) => method.syncCommonSettings(request, reply),
  );

  server.post(
      '/api/databaseutil/channel/sync',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步栏目数据' } },
      (request, reply) => method.syncChannel(request, reply),
  );

  server.post(
      '/api/databaseutil/article/sync',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步文章数据' } },
      (request, reply) => method.syncArticle(request, reply),
  );

  server.post(
      '/api/databaseutil/membercompany/sync',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步单位会员数据' } },
      (request, reply) => method.syncMemberCompany(request, reply),
  );

  next();
});
