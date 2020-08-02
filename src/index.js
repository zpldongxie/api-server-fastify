const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();

const fastify = require('fastify');
const fastifyBlipp = require('fastify-blipp');
const config = require('config');
const auth = require('./authenticate');
const usersRoutes = require('./modules/routes/users');
const statusRoutes = require('./modules/routes/status');
const channelRoutes = require('./modules/routes/channel');
const contentRoutes = require('./modules/routes/content');
const trainingRoutes = require('./modules/routes/training');
const trainingRegRoutes = require('./modules/routes/training-registration');
const errorThrowerRoutes = require('./modules/routes/error-thrower');
const restRoutes = require('./modules/routes/rest');
const db = require('./modules/db');
const mysql = require('./modules/mysql');

const server = fastify({
  // logger: true
});

server.register(auth);
server.register(fastifyBlipp);

// 连接数据库
server.register(db, config.get('db'));
server.register(mysql, config.get('mysql'));

// 设置跨域规则
server.register(require('fastify-cors'), {
  // TODO: 上生产环境后，应改为所有api开头的接口只允许后台管理服务器访问
  origin: (origin, cb) => {
    console.log(origin);
    // if (/localhost/.test(origin)) {
    //  Request from localhost will pass
    cb(null, true);
    //   return;
    // }
    // cb(new Error('Not allowed'), false);
  },
  methods: ['POST', 'GET', 'PUT'],
});

// 挂载路由
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
server.register(usersRoutes, {ajv});
server.register(channelRoutes, {ajv});
server.register(contentRoutes, config.get('oldManager'));
server.register(trainingRoutes, {ajv});
server.register(trainingRegRoutes);
server.register(statusRoutes);
server.register(errorThrowerRoutes);
server.register(restRoutes, {ajv});

const start = async () => {
  try {
    await server.listen(3000, '0.0.0.0');
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
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
