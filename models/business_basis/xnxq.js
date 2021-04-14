/*
 * @description: 学年学期
 * @author: zpl
 * @Date: 2021-04-14 14:25:28
 * @LastEditTime: 2021-04-14 14:25:28
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xnxq.js'

const { Model } = Sequelize

class XNXQ extends Model {
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
      tableName: "xnxq",
      sequelize,
      comment: '学年学期',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default XNXQ;
