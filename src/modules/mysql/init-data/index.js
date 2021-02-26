/*
 * @description: 初始化数据库
 * @author: zpl
 * @Date: 2020-07-27 12:40:11
 * @LastEditTime: 2021-02-25 19:07:38
 * @LastEditors: zpl
 */

/**
 * 初始化部门
 *
 * @param {*} DepartmentModel 用户组模型
 * @param {*} dataList 用户组初始数据
 * @return {Array} 操作结果
 */
const initDepartment = async (DepartmentModel, dataList) => {
  const result = [];
  try {
    for (const department of dataList) {
      await DepartmentModel.create(department);
      result.push(`department: ${department.name}，创建成功。`);
    }
  } catch (err) {
    const { errors } = err;
    if (errors && errors.length) {
      const { message } = errors[0];
      result.push(`数据库执行失败，department创建失败： ${message}`);
    }
    result.push(`系统异常，department创建失败： ${err}`);
  }
  return result;
};

/**
 * 初始化用户
 *
 * @param {*} DepartmentModel 用户组模型
 * @param {*} UserModel 用户模型
 * @param {*} dataList 用户初始数据
 * @return {Array} 操作结果
 */
const initUser = async (DepartmentModel, UserModel, dataList) => {
  const result = [];
  try {
    for (const user of dataList) {
      const { group, ...info } = user;

      const department = await DepartmentModel.findOne({
        where: { name: group },
      });
      if (department) {
        let needCreateDepartment = false;
        let tag;
        switch (department.tag) {
          case 'gywyh':
            // 委员会管理员
            needCreateDepartment = true;
            tag = 'wyhgly';
            break;
          case 'wyhgly':
            // 评定决定员
            needCreateDepartment = true;
            tag = 'pdjdy';
            break;
          case 'psjg':
            // 项目管理员
            needCreateDepartment = true;
            tag = 'xmgly';
            break;
          case 'xmgly':
            // 审核员
            needCreateDepartment = true;
            tag = 'shy';
            break;
          default:
            break;
        }

        if (needCreateDepartment) {
          const depName = info.companyName || info.loginName;
          const oldDepartment = await DepartmentModel.findOne({
            where: { name: depName, parentId: department.id },
          });
          if (oldDepartment) {
            result.push(`部门"${depName}"已存在，管理账号创建失败`);
          } else {
            const currentUser = await UserModel.create(info);
            result.push(`user: ${user.loginName}，创建成功。`);
            const currentDepartment = await DepartmentModel.create({
              name: depName,
              tag,
              parentId: department.id,
            });
            result.push(`已创建部门： ${currentDepartment.name}`);
            currentUser.setDepartments([currentDepartment]);
            await currentUser.save();
            result.push(`user： ${user.loginName}，部门关联成功。部门： ${currentDepartment.name}`);
          }
        } else {
          const currentUser = await UserModel.create(info);
          result.push(`user: ${user.loginName}，创建成功。`);
          await currentUser.setDepartments([department]);
          result.push(`user： ${user.loginName}，部门关联成功。部门： ${department.name}`);
        }
      } else {
        result.push(`user: ${user.loginName}，创建失败。需要先注册企业账号。`);
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
  const { Department, User, SysConfig } = models;
  const { userList, departmentList, sysConfig } = require('./data');
  let returnResult = [];

  const departments = await Department.findAll();
  if (departments && departments.length) return ['无需初始化'];

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据 开始---------------');
  console.log('-----------------------------------------------');

  console.log('1. 初始化部门...');
  returnResult = returnResult.concat(await initDepartment(Department, departmentList));
  console.log('2. 初始化用户...');
  returnResult = returnResult.concat(await initUser(Department, User, userList));
  console.log('3. 初始化系统配置...');
  returnResult = returnResult.concat(await initSysConfig(SysConfig, sysConfig));

  console.log('-----------------------------------------------');
  console.log('---------------初始化数据 结束---------------');
  console.log('-----------------------------------------------');

  return returnResult;
};
