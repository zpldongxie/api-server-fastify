const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();

const fastify = require('fastify');
const fastifyBlipp = require('fastify-blipp');
const config = require('config');
const usersRoutes = require('./modules/routes/users');
const statusRoutes = require('./modules/routes/status');
const contentRoutes = require('./modules/routes/content');
const trainingRoutes = require('./modules/routes/training-management');
const trainingRegRoutes = require('./modules/routes/training-registration');
const errorThrowerRoutes = require('./modules/routes/error-thrower');
const db = require('./modules/db');
const mysql = require('./modules/mysql');

const server = fastify();

server.register(fastifyBlipp);

// 连接数据库
server.register(db, config.get('db'));
server.register(mysql, config.get('mysql'));

// 挂载路由
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
server.register(usersRoutes, {ajv});
server.register(contentRoutes, config.get('oldManager'));
server.register(trainingRoutes, {ajv});
server.register(trainingRegRoutes);
server.register(statusRoutes);
server.register(errorThrowerRoutes);

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
