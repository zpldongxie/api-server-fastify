/*
 * @description: 节次信息
 * @author: zpl
 * @Date: 2021-04-13 19:50:8
 * @LastEditTime: 2021-04-13 19:56:22
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import jcxx from './schemas/jcxx.js'

const { Model } = Sequelize

class JCXX extends Model {
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
    return super.init(jcxx, {
      tableName: "jcxx",
      sequelize,
      comment: '节次信息',
    })
  }

  static associate(models) {
    // 节次信息 - 作息时间， 一对多
    models.JCXX.hasMany(models.ZXSJ)
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default JCXX;
