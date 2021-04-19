/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-19 09:01:21
 * @LastEditors: zpl
 * 
 */
import BJSJ from './bjsj.js'
import JCXX from './jcxx.js'
import NJSJ from './njsj.js'
import JZGJBSJ from './jzgjbsj.js'
import User from './user.js'
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
 * @param {*} XXDM 学校代码
 * @param {*} resetTable 是否重置所有数据库表
 */
const registerModels = (sequelize, XXDM, resetTable) => {
  const models = {
    BJSJ: BJSJ.init(sequelize, XXDM),
    JCXX: JCXX.init(sequelize, XXDM),
    NJSJ: NJSJ.init(sequelize, XXDM),
    JZGJBSJ: JZGJBSJ.init(sequelize, XXDM),
    User: User.init(sequelize, XXDM),
    XL: XL.init(sequelize, XXDM),
    XNJGSJ: XNJGSJ.init(sequelize, XXDM),
    XNXQ: XNXQ.init(sequelize, XXDM),
    XSJBSJ: XSJBSJ.init(sequelize, XXDM),
    XXJBSJ: XXJBSJ.init(sequelize, XXDM),
    ZXFA: ZXFA.init(sequelize, XXDM),
    ZXSJ: ZXSJ.init(sequelize, XXDM)
  }
  console.log("Importing business_basis models...")
  Object.values(models)
    .filter(model => typeof model.associate === "function")
    .forEach(model => {
      model.associate(models)
      model.sync({
        match: new RegExp('^' + sequelize.config.database + '$'),
        // alter: process.env.NODE_ENV != 'production',
        force: resetTable
      });
      console.log(` - ${model.name}`)
    });
}

export default registerModels;