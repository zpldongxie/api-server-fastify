/*
 * @description: mySql
 * @author: zpl
 * @Date: 2020-07-25 14:47:25
 * @LastEditTime: 2020-07-25 16:44:13
 * @LastEditors: zpl
 */
const {Sequelize} = require('sequelize');
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts, next) => {
  const {database, user, password} = opts;
  const sequelize = new Sequelize(database, user, password, {
    host: 'www.snains.cn',
    dialect: 'mysql',
  });
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const UserModel = require('./models/user')(sequelize, database);

    const models = {
      Users: UserModel,
    };

    fastify.decorate('mysql', {models});
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  next();
});
