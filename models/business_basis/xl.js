/*
 * @description: 校历
 * @author: zpl
 * @Date: 2021-04-13 19:50:8
 * @LastEditTime: 2021-04-13 19:50:8
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import xl from './schemas/xl.js'

const { Model } = Sequelize

class XL extends Model {
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
    return super.init(xl, {
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
