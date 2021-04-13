/*
 * @description: 年级数据
 * @author: zpl
 * @Date: 2021-04-13 17:29:51
 * @LastEditTime: 2021-04-13 18:44:24
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import njsj from './schemas/njsj.js'

const { Model } = Sequelize

class NJSJ extends Model {
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
      comment: '年级数据',
    })
  }

  static associate(models) {
    // 年级数据 - 班级数据， 一对多
    models.NJSJ.hasMany(models.BJSJ)
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default NJSJ;
