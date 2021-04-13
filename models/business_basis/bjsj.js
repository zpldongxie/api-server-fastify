/*
 * @description: 班级数据
 * @author: zpl
 * @Date: 2021-04-13 17:29:51
 * @LastEditTime: 2021-04-13 18:44:44
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import bjsj from './schemas/bjsj.js'

const { Model } = Sequelize

class BJSJ extends Model {
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
    return super.init(bjsj, {
      tableName: "bjsj",
      sequelize,
      comment: '班级数据',
    })
  }

  static associate(models) {
    // 班级数据 - 年级数据， 多对一
    models.NJSJ.belongsTo(models.BJSJ)
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default BJSJ;
