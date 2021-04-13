/*
 * @description: 作息时间
 * @author: zpl
 * @Date: 2021-04-13 19:50:8
 * @LastEditTime: 2021-04-13 20:03:55
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import zxsj from './schemas/zxsj.js'

const { Model } = Sequelize

class ZXSJ extends Model {
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
    return super.init(zxsj, {
      tableName: "zxsj",
      sequelize,
      comment: '作息时间',
    })
  }

  static associate(models) {
    // 作息时间 - 作息方案，多对一
    models.ZXSJ.belongsTo(models.ZXFA)

    // 作息时间 - 节次信息， 多对一
    models.ZXSJ.belongsTo(models.JCXX)
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }
}

export default ZXSJ;
