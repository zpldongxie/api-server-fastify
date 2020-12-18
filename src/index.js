const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();

const fastify = require('fastify')();
const path = require('path');
const config = require('config');
const auth = require('./authenticate');
const { load } = require('./util');
const mysql = require('./modules/mysql');

fastify.register(auth);
const swagger = require('./swagger');
fastify.register(swagger);

// 连接数据库
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

// 挂载路由
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const routeDir = path.resolve(__dirname, './routes');
// load(routeDir, (name, model) => {
//   fastify.register(model, { ajv, config });
// }, 'index.js');
fastify.get('/', function(request, reply) {
  reply.send({ hello: 'world' });
});

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.log('----uncaughtException----');
  console.error(error);
});
process.on('unhandledRejection', (error) => {
  console.log('----unhandledRejection----');
  console.error(error);
});

start();
