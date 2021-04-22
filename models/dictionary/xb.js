/*
 * @description: 人的性别代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-21 17:20:33
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xb.js'
import data from './initData/xb.js'

const { Model } = Sequelize

class XB extends Model {
  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @return {*} 
   * @memberof User
   */
   static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "xb",
      sequelize,
      comment: '人的性别代码',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }

  static async initData() {
      await this.destroy({ where: {} })
      await this.bulkCreate(data)
  }
}

export default XB;
