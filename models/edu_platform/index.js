/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-21 11:32:13
 * @LastEditors: zpl
 * 
 */
import User from './user.js'

/**
 * 注册models
 *
 * @param {*} sequelize 数据库映射对象
 * @param {*} config 配置信息
 */
const registerModels = async (sequelize, config) => {
  const { XXDM, resetTable, HMAC_KEY } = config;
  const models = {
    User: User.init(sequelize, XXDM, HMAC_KEY)
  }
  console.log("Importing edu_platform models...")
  const modelList = Object.values(models)
    .filter(model => typeof model.associate === "function")
  for (const model of modelList) {
    model.associate(models)
    await model.sync({
      match: new RegExp('^' + sequelize.config.database + '$'),
      // TODO: 频繁同步时如果有唯一约束，会不断创建索引产生脏数据，待解决
      // alter: process.env.NODE_ENV != 'production',
      force: resetTable
    });
    console.log(` - ${model.name}`)
    if (resetTable && typeof model.initData === 'function') {
      await model.initData()
    }
  }
  if (resetTable) {
    // 初始化用户信息，必须等分组等基础数据初始化完毕再执行
    console.log('创建初始账号。。。');
    await models.User.initAdmin()
    console.log('创建完成');
  }
}

export default registerModels;