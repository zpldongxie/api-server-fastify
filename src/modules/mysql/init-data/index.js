/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2020-12-21 10:18:37
 * @LastEditors: zpl
 */

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
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
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
        where: { name: user.group },
      });
      await currentUser.setUserGroups(groupList);
      console.log(`user: ${user.name}，用户组关联成功。`);
      result.push(`user: ${user.name}，用户组关联成功。`);
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
 * 初始化会员类型
 *
 * @param {*} MemberTypeModel 会员类型模型
 * @param {*} dataList 会员类型初始数据
 * @return {Array} 操作结果
 */
const initMemberType = async (MemberTypeModel, dataList) => {
  const result = [];
  try {
    for (const memberType of dataList) {
      const currentMemberType = await MemberTypeModel.create(memberType);
      console.log(`memberType: ${currentMemberType.name}，创建成功。`);
      result.push(`memberType: ${currentMemberType.name}，创建成功。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      console.error(`数据库执行失败： ${message}`);
      result.push(`数据库执行失败： ${message}`);
    }
    console.error(`系统异常，memberType创建失败： ${err}`);
    result.push(`系统异常，memberType创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化系统配置
 *
 * @param {*} SysConfigModel 系统配置模型
 * @param {*} dataList 系统配置初始数据
 * @return {Array} 操作结果
 */
const initSysConfig = async (SysConfigModel, dataList) => {
  const result = [];
  try {
    for (const config of dataList) {
      const currentSysConfig = await SysConfigModel.create(config);
      console.log(`sysConfig: ${currentSysConfig.name}，创建成功。`);
      result.push(`sysConfig: ${currentSysConfig.name}，创建成功。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      console.error(`数据库执行失败： ${message}`);
      result.push(`数据库执行失败： ${message}`);
    }
    console.error(`系统异常，memberType创建失败： ${err}`);
    result.push(`系统异常，memberType创建失败： ${err}`);
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
  const { UserGroup, User, MemberType, SysConfig } = models;
  const { userList, userGroupList, memberTypeList, sysConfig } = require('./data');
  let returnResult = [];

  const userGroups = await UserGroup.findAll();
  if (userGroups && userGroups.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化用户组...');
  returnResult = returnResult.concat(await initUserGroup(UserGroup, userGroupList));
  console.log('2. 初始化用户...');
  returnResult = returnResult.concat(await initUser(UserGroup, User, userList));
  console.log('3. 初始化会员类型...');
  returnResult = returnResult.concat(await initMemberType(MemberType, memberTypeList));
  console.log('4. 初始化系统配置...');
  returnResult = returnResult.concat(await initSysConfig(SysConfig, sysConfig));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
