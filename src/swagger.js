/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-07 10:32:25
 * @LastEditTime: 2020-08-07 13:59:25
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

'use strict';

module.exports = fp(async (server, opts, next) => {
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: '49.234.158.74:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {name: 'user', description: 'User related end-points'},
        {name: 'code', description: 'Code related end-points'},
      ],
      definitions: {
        User: {
          $id: 'User',
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: {type: 'string', format: 'uuid'},
            firstName: {type: 'string', nullable: true},
            lastName: {type: 'string', nullable: true},
            email: {type: 'string', format: 'email'},
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
