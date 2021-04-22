/*
 * @description: 婚姻状况代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-22 10:36:18
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/hyzk.js'
import data from './initData/hyzk.js'

const { Model } = Sequelize

class HYZK extends Model {
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
      tableName: "hyzk",
      sequelize,
      comment: '婚姻状况代码',
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

export default HYZK;
