require('source-map-support').install();

const fastify = require('fastify')();
const path = require('path');
const config = require('config');
const auth = require('./authenticate');
const { onRouterError, convertCatchInfo, load } = require('./util');
// const db = require('./modules/db');
const mysql = require('./modules/mysql');

fastify.register(auth);
const swagger = require('./swagger');
fastify.register(swagger);

// 连接数据库
// fastify.register(db, config.get('db'));
fastify.register(mysql, config.get('mysql'));

// 设置跨域规则
fastify.register(require('fastify-cors'), {
  // TODO: 上生产环境后，应改为所有api开头的接口只允许后台管理服务器访问
  origin: (origin, cb) => {
    console.log('origin', origin);
    // if (/localhost/.test(origin)) {
    //  Request from localhost will pass
    cb(null, true);
    //   return;
    // }
    // cb(new Error('Not allowed'), false);
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
});

const Ajv = require('ajv');
const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  coerceTypes: true,
});
// 全局异常捕捉
fastify.setErrorHandler((error, request, reply) => {
  console.log('-----捕捉到错误了-----');
  console.warn(error);
  const err = convertCatchInfo(error);
  onRouterError(reply, err);
});

// 挂载路由
const routeDir = path.resolve(__dirname, './routes');
load(routeDir, (name, model) => {
  fastify.register(model, { ajv, config });
}, 'index.js');

const start = async () => {
  try {
    await fastify.listen(4000, '0.0.0.0');
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.log('----uncaughtException----');
  console.error('error:', error);
});
process.on('unhandledRejection', (error) => {
  console.log('----unhandledRejection----');
  console.error('error:', error);
});

start();
