/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2021-03-11 18:16:11
 * @LastEditors: zpl
 */
const UserMethod = require('../../../routes/user/method');

/**
 * 初始化部门类别
 *
 * @param {*} DepTagModel 部门类别模型
 * @param {*} depTagList 部门类别初始数据
 * @return {Array} 操作结果
 */
const initDepTags = async (DepTagModel, depTagList) => {
  const result = [];
  try {
    for (const depTag of depTagList) {
      await DepTagModel.create(depTag);
      result.push(`depTag: ${depTag.name}，创建成功。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      console.error(`数据库执行失败，department创建失败： ${message}`);
      result.push(`数据库执行失败，department创建失败： ${message}`);
    }
    console.error(`系统异常，department创建失败： ${err}`);
    result.push(`系统异常，department创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化部门
 *
 * @param {*} DepTagModel 部门类别模型
 * @param {*} DepartmentModel 部门模型
 * @param {*} dataList 部门初始数据
 * @return {Array} 操作结果
 */
const initDepartment = async (DepTagModel, DepartmentModel, dataList) => {
  const result = [];
  try {
    for (const department of dataList) {
      const dep = await DepartmentModel.create(department);
      result.push(`department: ${department.name}，创建成功。`);
      const tag = await DepTagModel.findOne({ where: { name: department.tag } });
      dep.setDepTag(tag);
      await dep.save();
      result.push(`department: ${tag.descStr}已关联到${department.name}。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      console.error(`数据库执行失败，department创建失败： ${message}`);
      result.push(`数据库执行失败，department创建失败： ${message}`);
    }
    console.error(`系统异常，department创建失败： ${err}`);
    result.push(`系统异常，department创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化用户
 *
 * @param {*} mysqlModel
 * @param {*} dataList 用户初始数据
 * @return {Array} 操作结果
 */
const initUser = async (mysqlModel, dataList) => {
  const method = new UserMethod(mysqlModel, 'User', {});
  const result = [];
  try {
    for (const user of dataList) {
      const res = await method.createUser(user);
      if (res.status) {
        result.push(`user: ${user.loginName}，创建成功。`);
      } else {
        console.error(`user: ${user.loginName}，创建失败。${res.message}`);
        result.push(`user: ${user.loginName}，创建失败。${res.message}`);
      }
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
 * 初始化服务类型
 *
 * @param {*} ServiceTypeModel 服务类型模型
 * @param {*} dataList 服务类型初始数据
 * @return {Array} 操作结果
 */
const initServiceType = async (ServiceTypeModel, dataList) => {
  const result = [];
  try {
    for (const st of dataList) {
      const currentST = await ServiceTypeModel.create(st);
      result.push(`serviceType: ${currentST.name}，创建成功。`);
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
 * 初始化模块信息
 *
 * @param {*} ModularModel 模块信息模型
 * @param {*} modular 模块信息初始数据
 * @return {Array} 操作结果
 */
const initModularInfo = async (ModularModel, modular) => {
  const result = [];
  try {
    for (const m of modular) {
      const currentModular = await ModularModel.create(m);
      result.push(`serviceType: ${currentModular.name}，创建成功。`);
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
  const { DepTag, Department, ServiceType, Modular, SysConfig } = models;
  const { depTag, userList, departmentList, serviceType, modular, sysConfig } = require('./data');
  let returnResult = [];

  const departments = await Department.findAll();
  if (departments && departments.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化部门类别...');
  returnResult = returnResult.concat(await initDepTags(DepTag, depTag));
  console.log('1. 初始化部门...');
  returnResult = returnResult.concat(await initDepartment(DepTag, Department, departmentList));
  console.log('2. 初始化用户...');
  returnResult = returnResult.concat(await initUser(models, userList));
  console.log('3. 初始化服务类别...');
  returnResult = returnResult.concat(await initServiceType(ServiceType, serviceType));
  console.log('4. 初始化模块信息...');
  returnResult = returnResult.concat(await initModularInfo(Modular, modular));
  console.log('5. 初始化系统配置...');
  returnResult = returnResult.concat(await initSysConfig(SysConfig, sysConfig));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
