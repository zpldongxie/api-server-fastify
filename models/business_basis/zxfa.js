/*
 * @description: 作息方案
 * @author: zpl
 * @Date: 2021-04-13 19:50:8
 * @LastEditTime: 2021-04-13 20:03:31
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import njsj from './schemas/njsj.js'

const { Model } = Sequelize

class ZXFA extends Model {
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
    return super.init(njsj, {
      tableName: "njsj",
      sequelize,
      comment: '作息方案',
    })
  }

  static associate(models) {
    // 作息方案 - 作息时间，一对多
    models.ZXFA.hasMany(models.ZXSJ)
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default ZXFA;
