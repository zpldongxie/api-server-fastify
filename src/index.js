const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();

const fastify = require('fastify');
const fastifyBlipp = require('fastify-blipp');
const config = require('config');
const statusRoutes = require('./modules/routes/status');
const trainingRoutes = require('./modules/routes/training-management');
const errorThrowerRoutes = require('./modules/routes/error-thrower');
const db = require('./modules/db');

const server = fastify({logger: true});

server.register(fastifyBlipp);
server.register(db, config.get('db'));
server.register(trainingRoutes);
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
  console.error(error);
});
process.on('unhandledRejection', (error) => {
  console.error(error);
});

start();
