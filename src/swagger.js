/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-07 10:32:25
 * @LastEditTime: 2021-03-01 17:22:25
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

'use strict';

module.exports = fp(async (server, opts, next) => {
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: '网安联',
        description: '网安服务机构等级评定系统api，仅供内部使用，正式发版本后，此界面禁止查看。',
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
        { name: 'user', description: '用户' },
        { name: 'sysconfig', description: '系统配置' },
      ],
      // definitions: {
      //   User: {
      //     $id: 'User',
      //     type: 'object',
      //     required: ['id', 'email'],
      //     properties: {
      //       id: { type: 'string', format: 'uuid' },
      //       firstName: { type: 'string', nullable: true },
      //       lastName: { type: 'string', nullable: true },
      //       email: { type: 'string', format: 'email' },
      //     },
      //   },
      // },
      // TODO: 有空研究一下
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
