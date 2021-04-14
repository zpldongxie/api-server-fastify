/*
 * @description: 校历
 * @author: zpl
 * @Date: 2021-04-14 14:25:28
 * @LastEditTime: 2021-04-14 14:25:28
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xl.js'

const { Model } = Sequelize

class XL extends Model {
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
      tableName: "xl",
      sequelize,
      comment: '校历',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default XL;
