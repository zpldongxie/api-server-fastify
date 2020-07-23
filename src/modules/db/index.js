/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-21 18:28:31
 * @LastEditTime: 2020-07-23 11:38:26
 * @LastEditors: zpl
 */
const Mongoose = require('mongoose');
const {Training} = require('./models/training-management');

const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts, next) => {
  Mongoose.connection.on('connected', () => {
    fastify.log.info({actor: 'MongoDB'}, 'connected');
  });

  Mongoose.connection.on('disconnected', () => {
    fastify.log.error({actor: 'MongoDB'}, 'disconnected');
  });

  await Mongoose.connect(
      opts.uri,
      {
        useNewUrlParser: true,
        keepAlive: 1,
      },
  );

  const models = {
    Training: Training,
  };

  fastify.decorate('db', {models});

  next();
});
