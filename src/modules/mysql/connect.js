/*
 * @description: 连接实例
 * @author: zpl
 * @Date: 2020-07-25 20:44:11
 * @LastEditTime: 2020-07-25 21:05:47
 * @LastEditors: zpl
 */
const {Sequelize} = require('sequelize');

const config = require('config');
const mysqlConf = config.get('mysql');
const {database, user, password} = mysqlConf;

const sequelize = new Sequelize(database, user, password, {
  host: 'www.snains.cn',
  dialect: 'mysql',
});

module.exports = sequelize;
