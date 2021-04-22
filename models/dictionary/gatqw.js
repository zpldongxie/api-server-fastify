/*
 * @description: 港澳台侨外代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-22 10:44:53
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/gatqw.js'
import data from './initData/gatqw.js'

const { Model } = Sequelize

class GATQW extends Model {
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
      tableName: "gatqw",
      sequelize,
      comment: '港澳台侨外代码',
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

export default GATQW;
