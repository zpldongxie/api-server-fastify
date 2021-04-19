/*
 * @description: 学生基本数据
 * @author: zpl
 * @Date: 2021-04-19 8:58:45
 * @LastEditTime: 2021-04-19 8:58:45
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xsjbsj.js'

const { Model } = Sequelize

class XSJBSJ extends Model {
  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @param {*} XXDM 学校代码
   * @return {*} 
   * @memberof User
   */
   static init(sequelize, XXDM) {
    return super.init(getSchema(XXDM), {
      tableName: "xsjbsj",
      sequelize,
      comment: '学生基本数据',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default XSJBSJ;
