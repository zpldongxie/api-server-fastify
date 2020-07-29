/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2020-07-28 14:01:38
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
 * 检查表是否存在，如不存在，则自动创建
 *
 * @param {*} database
 * @param {*} models
 */
const checkTablesExists = async (database, models) => {
  const {
    User,
    UserGroup,
    Channel,
    ContentDetail,
    ChannelSetting,
    Training,
    TrainingReg,
  } = models;
  console.log('===============数据库表创建开始===============');
  await User.sync({match: new RegExp('^' + database + '$')});
  await UserGroup.sync({match: new RegExp('^' + database + '$')});
  await models['user-group-user'].sync({match: new RegExp('^' + database + '$')});
  await Channel.sync({match: new RegExp('^' + database + '$')});
  await ContentDetail.sync({match: new RegExp('^' + database + '$')});
  await models['content_detail_channel'].sync({match: new RegExp('^' + database + '$')});
  // 注意会强制多生成ChannelId外键，对原java系统会产生影响，先手动删除多余外键
  await ChannelSetting.sync({match: new RegExp('^' + database + '$')});
  await Training.sync({match: new RegExp('^' + database + '$')});
  await TrainingReg.sync({match: new RegExp('^' + database + '$')});
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
  const {UserGroup, User} = models;
  const {userList, userGroupList} = require('./data');
  let returnResult = [];

  if (needCreatTable) {
    await checkTablesExists(database, models);
  }

  const userGroups = await UserGroup.findAll();
  if (userGroups && userGroups.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化用户组...');
  returnResult = returnResult.concat(await initUserGroup(UserGroup, userGroupList));
  console.log('2. 初始化用户...');
  returnResult = returnResult.concat(await initUser(UserGroup, User, userList));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据库 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
