/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2020-12-18 12:07:16
 * @LastEditors: zpl
 */

/**
 * 初始化用户
 *
 * @param {*} UserModel 用户模型
 * @param {*} dataList 用户初始数据
 * @return {Array} 操作结果
 */
const initUser = async (UserModel, dataList) => {
  const result = [];
  try {
    for (const user of dataList) {
      await UserModel.create(user);
      console.log(`user: ${user.name}，创建成功。`);
      result.push(`user: ${user.name}，创建成功。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      console.error(`数据库执行失败： ${message}`);
      result.push(`数据库执行失败： ${message}`);
    }
    console.error(`系统异常，user创建失败： ${err}`);
    result.push(`系统异常，user创建失败： ${err}`);
  }
  return result;
};

/**
 * 检查表是否存在，如不存在，则自动创建
 *
 * @param {*} database
 * @param {*} models
 */
const checkTablesExists = async (database, models) => {
  console.log('===============数据库表创建开始===============');
  for (const key in models) {
    if (models.hasOwnProperty(key)) {
      console.log(`----------创建 ${key} 表----------`);
      const Model = models[key];
      await Model.sync({ match: new RegExp('^' + database + '$') });
      console.log(`----------创建 ${key} 表结束----------`);
    }
  }
  console.log('===============数据库表创建结束===============');
};

/**
 * 初始化数据库
 *
 * @param {*} models
 * @param {Boolean} needCreatTable
 * @param {String} database
 * @return {Array} 执行结果
 */
module.exports = async (models, needCreatTable, database) => {
  const { User } = models;
  const { userList } = require('./data');
  let returnResult = [];

  if (needCreatTable) {
    await checkTablesExists(database, models);
  }

  const users = await User.findAll();
  if (users && users.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化用户...');
  returnResult = returnResult.concat(await initUser(User, userList));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
