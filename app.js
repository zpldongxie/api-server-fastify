import AutoLoad from 'fastify-autoload'
import Sensible from 'fastify-sensible'
import Env from 'fastify-env'
import Cors from 'fastify-cors'
import UnderPressure from 'under-pressure'
import S from 'fluent-json-schema'
import { join } from 'desm'

export default async function (fastify, opts) {
  // It's very common to pass secrets and configuration to you application via environment variables.
  // The `fastify-env` plugin will expose those configuration under `fastify.config` and validate those at startup.
  fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().enum(['dev', 'production']).required())
      .prop('XXDM', S.string().required())
      .prop('COOKIE_SECRET', S.string().required())
      .prop('HMAC_KEY', S.string().required())
      .prop('UPLOAD_ROOT_PATH', S.string().required())
      .valueOf()
  })

  // `fastify-sensible` adds many small utilities, such as nice http errors.
  fastify.register(Sensible)

  // This plugin is especially useful if you expect an high load
  // on your application, it measures the process load and returns
  // a 503 if the process is undergoing too much stress.
  fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98
  })

  // 支持跨域
  // https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
  fastify.register(Cors, {
    origin: false,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
  })

  // Normally you would need to load by hand each plugin. 
  // `fastify-autoload` is an utility we wrote to solve this specific problems. 
  // It loads all the content from the specified folder, even the subfolders. 
  // Take at look at its documentation, as it's doing a lot more!
  // First of all, we require all the plugins that we'll need in our application.
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: Object.assign({}, opts)
  })

  // Then, we'll load all of our routes.
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts)
  })
}
// TODO 统一参数验证
// TODO 全局异常处理

