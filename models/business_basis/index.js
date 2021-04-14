/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-13 20:06:37
 * @LastEditors: zpl
 * 
 */
import BJSJ from './bjsj.js'
import JCXX from './jcxx.js'
import NJSJ from './njsj.js'
import XL from './xl.js'
import XNJGSJ from './xnjgsj.js'
import User from './user.js'
import XNXQ from './xnxq.js'
import XXJBSJ from './xxjbsj.js'
import ZXFA from './zxfa.js'
import ZXSJ from './zxsj.js'

export default (sequelize, resetTable) => {
  const models = {
    BJSJ: BJSJ.init(sequelize),
    JCXX: JCXX.init(sequelize),
    NJSJ: NJSJ.init(sequelize),
    XL: XL.init(sequelize),
    XNJGSJ: XNJGSJ.init(sequelize),
    User: User.init(sequelize),
    XNXQ: XNXQ.init(sequelize),
    XXJBSJ: XXJBSJ.init(sequelize),
    ZXFA: ZXFA.init(sequelize),
    ZXSJ: ZXSJ.init(sequelize),
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