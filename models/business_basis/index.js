/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-21 14:39:10
 * @LastEditors: zpl
 * 
 */
import BJSJ from './bjsj.js'
import JCXX from './jcxx.js'
import NJSJ from './njsj.js'
import JZGJBSJ from './jzgjbsj.js'
import XL from './xl.js'
import XNJGSJ from './xnjgsj.js'
import XNXQ from './xnxq.js'
import XSJBSJ from './xsjbsj.js'
import XXJBSJ from './xxjbsj.js'
import ZXFA from './zxfa.js'
import ZXSJ from './zxsj.js'

/**
 * 注册models
 *
 * @param {*} sequelize 数据库映射对象
 * @param {*} config 配置信息
 */
 const registerModels = async (sequelize, config) => {
  const { XXDM, resetTable } = config;
  const models = {
    BJSJ: BJSJ.init(sequelize, XXDM),
    JCXX: JCXX.init(sequelize, XXDM),
    NJSJ: NJSJ.init(sequelize, XXDM),
    JZGJBSJ: JZGJBSJ.init(sequelize, XXDM),
    XL: XL.init(sequelize, XXDM),
    XNJGSJ: XNJGSJ.init(sequelize, XXDM),
    XNXQ: XNXQ.init(sequelize, XXDM),
    XSJBSJ: XSJBSJ.init(sequelize, XXDM),
    XXJBSJ: XXJBSJ.init(sequelize, XXDM),
    ZXFA: ZXFA.init(sequelize, XXDM),
    ZXSJ: ZXSJ.init(sequelize, XXDM)
  }
  console.log("Importing business_basis models...")
  const modelList = Object.values(models)
    .filter(model => typeof model.associate === "function")
  for (const model of modelList) {
    model.associate(models)
    await model.sync({
      match: new RegExp('^' + sequelize.config.database + '$'),
      // alter: process.env.NODE_ENV != 'production',
      force: resetTable
    });
    if (resetTable && typeof model.initData === 'function') {
      await model.initData()
    }
  }
  console.log('business_basis models imported.');
}

export default registerModels;