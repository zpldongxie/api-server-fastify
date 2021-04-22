/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-22 13:21:56
 * @LastEditors: zpl
 * 
 */
import BXLX from './bxlx.js'
import GATQW from './gatqw.js'
import GJDQ from './gjdq.js'
import HKLB from './hklb.js'
import HYZK from './hyzk.js'
import JKZK1 from './jkzk1.js'
import JKZK2 from './jkzk1.js'
import MZ from './mz.js'
import NJ from './nj.js'
import SFBZ from './sfbz.js'
import SSMZSYJXMS from './ssmzsyjxms.js'
import SZDCXLX from './szdcxlx.js'
import SZDQJJSX from './szdqjjsx.js'
import XB from './xb.js'
import XSLB from './xslb.js'
import XX from './xx.js'
import XXBB from './xxbb.js'
import XZ from './xz.js'
import XZQH from './xzqh.js'
import ZGYZ from './zgyz.js'
import ZJXY from './zjxy.js'
import ZXXBJLX from './zxxbjlx.js'
import ZZMM from './zzmm.js'

/**
 * 注册models
 *
 * @param {*} sequelize 数据库映射对象
 * @param {*} config 配置信息
 */
const registerModels = async (sequelize, config) => {
  const { resetTable } = config;
  const models = {
    BXLX: BXLX.init(sequelize),
    GATQW: GATQW.init(sequelize),
    GJDQ: GJDQ.init(sequelize),
    HKLB: HKLB.init(sequelize),
    HYZK: HYZK.init(sequelize),
    JKZK1: JKZK1.init(sequelize),
    JKZK2: JKZK2.init(sequelize),
    MZ: MZ.init(sequelize),
    NJ: NJ.init(sequelize),
    SFBZ: SFBZ.init(sequelize),
    SSMZSYJXMS: SSMZSYJXMS.init(sequelize),
    SZDCXLX: SZDCXLX.init(sequelize),
    SZDQJJSX: SZDQJJSX.init(sequelize),
    XB: XB.init(sequelize),
    XSLB: XSLB.init(sequelize),
    XX: XX.init(sequelize),
    XXBB: XXBB.init(sequelize),
    XZ: XZ.init(sequelize),
    XZQH: XZQH.init(sequelize),
    ZGYZ: ZGYZ.init(sequelize),
    ZJXY: ZJXY.init(sequelize),
    ZXXBJLX: ZXXBJLX.init(sequelize),
    ZZMM: ZZMM.init(sequelize),
  }
  console.log("Importing dictionary models...")
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
    if (resetTable && typeof model.initData === 'function') {
      console.log('初始化数据：', model);
      await model.initData()
      console.log('完成');
    }
  }
  console.log('dictionary models imported.');
}

export default registerModels;