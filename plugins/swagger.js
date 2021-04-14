import { readFileSync } from 'fs'
import { join } from 'desm'
import fp from 'fastify-plugin'
import Swagger from 'fastify-swagger'

const { version } = JSON.parse(readFileSync(join(import.meta.url, '../package.json')))

async function swaggerGenerator (fastify, opts) {
  // Swagger documentation generator for Fastify.
  // It uses the schemas you declare in your routes to generate a swagger compliant doc.
  // https://github.com/fastify/fastify-swagger
  // swagger 2.0 options
  const swaggerOpt = {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: '智慧教育平台',
        description: '智慧教育平台api，仅供内部使用，正式发版后，此界面禁止查看。',
        version
      },
      externalDocs: {
        url: 'https://github.com/fastify/fastify-swagger',
        description: 'fastify-swagger技术参考',
      },
      // host: 'localhost', // and your deployed url
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
      tags: [
        { name: 'auth', description: '认证' },
        { name: 'user', description: '用户' },
        { name: 'other', description: '其他' },
      ],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Bearer',
          in: 'header'
        },
        Csrf: {
          type: 'apiKey',
          name: 'x-csrf-token',
          in: 'header'
        }
      }
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    // let's expose the documentation only in development
    // it's up to you decide who should see this page,
    // but it's alwaysx better to start safe.
    exposeRoute: fastify.config.NODE_ENV !== 'production'
  }

  // openapi 3.0.3 options
  const openapiOpt = {
    routePrefix: '/documentation',
    openapi: {
      info: {
        title: '智慧教育平台',
        description: '智慧教育平台api，仅供内部使用，正式发版后，此界面禁止查看。',
        version,
      },
      externalDocs: {
        url: 'https://github.com/fastify/fastify-swagger',
        description: 'fastify-swagger技术参考',
      },
      servers: [{
        url: 'http://49.233.193.39:3000'
      }],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header'
          }
        }
      },
      // security: [ Object ],
      tags: [
        { name: 'auth', description: '认证' },
        { name: 'user', description: '用户' },
        { name: 'other', description: '其他' },
      ]
    },
    exposeRoute: fastify.config.NODE_ENV !== 'production'
  }

  fastify.register(Swagger, openapiOpt)
}

export default fp(swaggerGenerator, {
  name: 'swaggerGenerator'
})
