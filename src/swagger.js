/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-07 10:32:25
 * @LastEditTime: 2020-09-08 10:58:42
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
        { name: 'user', description: '用户管理' },
        { name: 'usergroup', description: '用户组管理' },
        { name: 'cnannel', description: '栏目管理' },
        { name: 'channelsetting', description: '栏目配置管理' },
        { name: 'contentdetail', description: '文章管理' },
        { name: 'training', description: '培训管理' },
        { name: 'trainingreg', description: '培训报名管理' },
        { name: 'membercompany', description: '企业会员管理' },
        { name: 'memberindivic', description: '个人会员管理' },
        { name: 'membertype', description: '会员类别管理' },
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
