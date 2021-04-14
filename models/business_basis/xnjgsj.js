/*
 * @description: 校内机构数据
 * @author: zpl
 * @Date: 2021-04-13 18:45:21
 * @LastEditTime: 2021-04-13 18:45:21
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import xnjgsj from './schemas/xnjgsj.js'

const { Model } = Sequelize

class XNJGSJ extends Model {
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
    return super.init(xnjgsj, {
      tableName: "xnjgsj",
      sequelize,
      comment: '校内机构数据',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default XNJGSJ;
