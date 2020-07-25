/*
 * @description: mySql
 * @author: zpl
 * @Date: 2020-07-25 14:47:25
 * @LastEditTime: 2020-07-25 20:57:58
 * @LastEditors: zpl
 */

const fp = require('fastify-plugin');
const sequelize = require('./connect');
const UserModel = require('./models/user');
const ChannelModel = require('./models/channel');
const TrainingModel = require('./models/training');

module.exports = fp(async (fastify, opts, next) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const models = {
      UserModel,
      ChannelModel,
      TrainingModel,
    };

    fastify.decorate('mysql', {models});
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  next();
});
