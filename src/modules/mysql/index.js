/*
 * @description: mySql
 * @author: zpl
 * @Date: 2020-07-25 14:47:25
 * @LastEditTime: 2021-02-01 08:59:35
 * @LastEditors: zpl
 */

const fp = require('fastify-plugin');
const { Sequelize } = require('sequelize');

const { loadModel, buildRoute } = require('./framework/loader');

module.exports = fp(async (fastify, opts, next) => {
  const { host, database, user, password, dialect, pool, needCreatTable, dropOldTable } = opts;
  const sequelize = new Sequelize(database, user, password, {
    host,
    dialect,
    pool,
    operatorsAliases: false, // 仍可通过传入 operators map 至 operatorsAliases 的方式来使用字符串运算符，但会返回弃用警告
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await loadModel(sequelize, needCreatTable, dropOldTable, database);
    await buildRoute(sequelize.models);

    const initResult = await require('./init-data')(sequelize.models);
    console.log('数据库初始化执行结果：');
    console.log(initResult);
    fastify.decorate('sequelize', sequelize);
    fastify.decorate('mysql', { models: sequelize.models });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  next();
});
