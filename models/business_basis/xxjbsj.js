/*
 * @description: 学校基本数据
 * @author: zpl
 * @Date: 2021-04-13 18:45:21
 * @LastEditTime: 2021-04-13 18:45:21
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import xxjbsj from './schemas/xxjbsj.js'

const { Model } = Sequelize

class XXJBSJ extends Model {
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
    return super.init(xxjbsj, {
      tableName: "xxjbsj",
      sequelize,
      comment: '学校基本数据',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default XXJBSJ;
