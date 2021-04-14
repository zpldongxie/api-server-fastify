/*
 * @description: 作息方案
 * @author: zpl
 * @Date: 2021-04-14 14:25:28
 * @LastEditTime: 2021-04-14 14:25:28
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zxfa.js'

const { Model } = Sequelize

class ZXFA extends Model {
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
      tableName: "zxfa",
      sequelize,
      comment: '作息方案',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default ZXFA;
