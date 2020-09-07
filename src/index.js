const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();

const fastify = require('fastify');
const path = require('path');
const config = require('config');
const auth = require('./authenticate');
const { load } = require('./util');
// const db = require('./modules/db');
const mysql = require('./modules/mysql');

const server = fastify({
  // logger: true
});

server.register(auth);
const swagger = require('./swagger');
server.register(swagger);

// 连接数据库
// server.register(db, config.get('db'));
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
const ajv = new Ajv({ allErrors: true });
const routeDir = path.resolve(__dirname, './routes');
load(routeDir, (name, model) => {
  server.register(model, { ajv });
}, 'index.js');

const start = async () => {
  try {
    await server.listen(3000, '0.0.0.0');
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
