/*
 * @description: 不使用cli时，请直接以此文件为入口，使用npm执行
 * @author: zpl
 * @Date: 2021-04-10 14:12:29
 * @LastEditTime: 2021-04-10 15:12:22
 * @LastEditors: zpl
 */
'use strict'

// Read the .env file.
import dotenv from 'dotenv'
import Fastify from 'fastify'
import App from './app.js'

dotenv.config()
// require('dotenv').config()

// Require the framework
// const Fas/tify = require('fastify')

// TODO: 通过cli无法生成日志文件？

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: 'info',
    file: './logs',
    prettyPrint: true,
    serializers: {
      res (reply) {
        // The default
        return {
          statusCode: reply.statusCode
        }
      },
      req (request) {
        return {
          method: request.method,
          url: request.url,
          path: request.path,
          parameters: request.parameters,
          // Including the headers in the log could be in violation
          // of privacy laws, e.g. GDPR. You should use the "redact" option to
          // remove sensitive fields. It could also leak authentication data in
          // the logs.
          headers: request.headers
        };
      }
    }
  },
  pluginTimeout: 10000
})

// Register your application as a normal plugin.
app.register(App)
// app.register(require('./app.js'))

// Start listening.
app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})