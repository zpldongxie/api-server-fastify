/*
 * @description: mongoodb
 * @author: zpl
 * @Date: 2020-07-21 18:28:31
 * @LastEditTime: 2020-07-25 15:07:14
 * @LastEditors: zpl
 */
const Mongoose = require('mongoose');
const Training = require('./models/training-management');
const TrainingReg = require('./models/training-registration');

const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts, next) => {
  Mongoose.connection.on('connected', () => {
    fastify.log.info({actor: 'MongoDB'}, 'connected');
  });

  Mongoose.connection.on('disconnected', () => {
    fastify.log.error({actor: 'MongoDB'}, 'disconnected');
  });

  const {uri, user, pass} = opts;
  await Mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        keepAlive: 1,
        user: user,
        pass: pass,
      },
  );

  const models = {
    Training: Training,
    TrainingReg: TrainingReg,
  };

  fastify.decorate('db', {models});

  next();
});
