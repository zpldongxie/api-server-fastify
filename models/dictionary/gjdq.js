/*
 * @description: 世界各国和地区名称代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-22 09:49:50
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/gjdq.js'
import data from './initData/gjdq.js'

const { Model } = Sequelize

class GJDQ extends Model {
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
      tableName: "gjdq",
      sequelize,
      comment: '国家地区',
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

export default GJDQ;
