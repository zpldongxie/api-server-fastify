/*
 * @description: 学年学期
 * @author: zpl
 * @Date: 2021-04-13 19:50:8
 * @LastEditTime: 2021-04-13 19:50:8
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import xnxq from './schemas/xnxq.js'

const { Model } = Sequelize

class XNXQ extends Model {
  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @param {*} DataTypes
   * @return {*} 
   * @memberof User
   */
   static init(sequelize) {
    return super.init(xnxq, {
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
