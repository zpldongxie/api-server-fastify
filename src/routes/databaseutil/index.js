/*
 * @description: 数据库工具
 * @author: zpl
 * @Date: 2021-01-31 20:06:21
 * @LastEditTime: 2021-02-18 17:12:18
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const CommonMethod = require('../commonMethod');
const Method = require('./method');

module.exports = fp(async (server, opts, next) => {
  const { ajv } = opts;
  const mysqlModel = server.mysql.models;
  const SysConfigModule = mysqlModel.SysConfig;
  const ChannelModule = mysqlModel.Channel;
  const ChannelTypeModule = mysqlModel.ChannelType;
  const ChannelSettingModule = mysqlModel.ChannelSetting;
  const ArticleModule = mysqlModel.Article;

  const method = new Method({
    sysConfigDBMethod: new CommonMethod(SysConfigModule, ajv).dbMethod,
    channelDBMethod: new CommonMethod(ChannelModule, ajv).dbMethod,
    channelTypeDBMethod: new CommonMethod(ChannelTypeModule, ajv).dbMethod,
    channelSettingDBMethod: new CommonMethod(ChannelSettingModule, ajv).dbMethod,
    articleDBMethod: new CommonMethod(ArticleModule, ajv).dbMethod,
  });

  server.post(
      '/api/databaseutil/channel/async',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步栏目数据' } },
      (request, reply) => method.asyncChannel(request, reply),
  );

  server.post(
      '/api/databaseutil/channelsettings/async',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步栏目配置数据' } },
      (request, reply) => method.asyncChannelSettings(request, reply),
  );

  server.post(
      '/api/databaseutil/article/async',
      { schema: { tags: ['数据库工具'], summary: '从旧数据库同步文章数据' } },
      (request, reply) => method.asyncArticle(request, reply),
  );

  next();
});
