/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-07 10:32:25
 * @LastEditTime: 2021-02-23 08:51:21
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

'use strict';

module.exports = fp(async (server, opts, next) => {
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: '网安协会API',
        description: 'api',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://github.com/fastify/fastify-swagger',
        description: 'fastify-swagger技术参考',
      },
      // host: '49.234.158.74:3000',
      // schemes: ['http'],
      // consumes: ['application/json'],
      // produces: ['application/json'],
      tags: [
        { name: 'rest', description: '所有对外rest接口' },
        { name: 'user', description: '用户' },
        { name: 'usergroup', description: '用户组' },
        { name: 'channel', description: '栏目' },
        { name: 'channelsetting', description: '栏目配置' },
        { name: 'channeltype', description: '栏目类型' },
        { name: 'article', description: '文章' },
        { name: 'articleextension', description: '文章扩展' },
        { name: 'training', description: '培训' },
        { name: 'trainingreg', description: '培训报名' },
        { name: 'membercompany', description: '单位会员' },
        { name: 'memberindivic', description: '个人会员' },
        { name: 'membertype', description: '会员类别' },
        { name: 'entry', description: '入驻申请' },
        { name: 'servicerequest', description: '服务申请' },
        { name: 'sysconfig', description: '系统配置' },
      ],
      definitions: {
        User: {
          $id: 'User',
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
          },
        },
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });

  server.ready((err) => {
    if (err) throw err;
    server.swagger();
  });

  next();
});
