/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2020-07-27 14:03:55
 * @LastEditors: zpl
 */
const initDatabase = async (models) => {
  const {UserModel, UserGroupModel} = models;
  const {userList, userGroupList} = require('./data');
  const returnResult = [];

  // 初始化用户组
  try {
    for (const userGroup of userGroupList) {
      await UserGroupModel.create(userGroup);
      console.log(`userGroup: ${userGroup.name}，创建成功。`);
      returnResult.push(`userGroup: ${userGroup.name}，创建成功。`);
    }
  } catch (err) {
    const {errors} = err;
    if (errors && errors.length) {
      const {message} = errors[0];
      console.error(`数据库执行失败，userGroup创建失败： ${message}`);
      returnResult.push(`数据库执行失败，userGroup创建失败： ${message}`);
    }
    console.error(`系统异常，userGroup创建失败： ${err}`);
    returnResult.push(`系统异常，userGroup创建失败： ${err}`);
  }

  // 初始化用户
  try {
    for (const user of userList) {
      const currentUser = await UserModel.create(user);
      console.log(`user: ${user.name}，创建成功。`);
      returnResult.push(`user: ${user.name}，创建成功。`);
      const groupList = await UserGroupModel.findAll({
        where: {name: user.group},
      });
      await currentUser.setGroups(groupList);
      console.log(`user: ${user.name}，用户组关联成功。`);
      returnResult.push(`user: ${user.name}，用户组关联成功。`);
    }
  } catch (err) {
    const {errors} = err;
    if (errors && errors.length) {
      const {message} = errors[0];
      console.error(`数据库执行失败： ${message}`);
      returnResult.push(`数据库执行失败： ${message}`);
    }
    console.error(`系统异常，user创建失败： ${err}`);
    returnResult.push(`系统异常，user创建失败： ${err}`);
  }

  return reply.code(200).send(returnResult);
};

/**
 * 初始化用户组
 *
 * @param {*} UserGroupModel 用户组模型
 * @param {*} dataList 用户组初始数据
 * @return {Array} 操作结果
 */
const initUserGroup = async (UserGroupModel, dataList) => {
  const result = [];
  try {
    for (const userGroup of dataList) {
      await UserGroupModel.create(userGroup);
      console.log(`userGroup: ${userGroup.name}，创建成功。`);
      result.push(`userGroup: ${userGroup.name}，创建成功。`);
    }
  } catch (err) {
    const {errors} = err;
    if (errors && errors.length) {
      const {message} = errors[0];
      console.error(`数据库执行失败，userGroup创建失败： ${message}`);
      result.push(`数据库执行失败，userGroup创建失败： ${message}`);
    }
    console.error(`系统异常，userGroup创建失败： ${err}`);
    result.push(`系统异常，userGroup创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化用户
 *
 * @param {*} UserGroupModel 用户组模型
 * @param {*} UserModel 用户模型
 * @param {*} dataList 用户初始数据
 * @return {Array} 操作结果
 */
const initUser = async (UserGroupModel, UserModel, dataList) => {
  const result = [];
  try {
    for (const user of dataList) {
      const currentUser = await UserModel.create(user);
      console.log(`user: ${user.name}，创建成功。`);
      result.push(`user: ${user.name}，创建成功。`);
      const groupList = await UserGroupModel.findAll({
        where: {name: user.group},
      });
      await currentUser.setGroups(groupList);
      console.log(`user: ${user.name}，用户组关联成功。`);
      result.push(`user: ${user.name}，用户组关联成功。`);
    }
  } catch (err) {
    const {errors} = err;
    if (errors && errors.length) {
      const {message} = errors[0];
      console.error(`数据库执行失败： ${message}`);
      result.push(`数据库执行失败： ${message}`);
    }
    console.error(`系统异常，user创建失败： ${err}`);
    result.push(`系统异常，user创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化数据库
 *
 * @param {*} models
 * @return {Array} 执行结果
 */
module.exports = async (models) => {
  const {UserGroupModel, UserModel} = models;
  const {userList, userGroupList} = require('./data');
  let returnResult = [];

  const userGroups = await UserGroupModel.findAll();
  if (userGroups && userGroups.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化用户组...');
  returnResult = returnResult.concat(await initUserGroup(UserGroupModel, userGroupList));
  console.log('2. 初始化用户...');
  returnResult = returnResult.concat(await initUser(UserGroupModel, UserModel, userList));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
