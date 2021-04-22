/*
 * @description: 身份证件类型
 * @author: zpl
 * @Date: 2021-04-22 10:18:23
 * @LastEditTime: 2021-04-22 10:22:06
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/sfzjlx.js'
import data from './initData/sfzjlx.js'

const { Model } = Sequelize

class SFZJLX extends Model {
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
      tableName: "sfzjlx",
      sequelize,
      comment: '身份证件类型',
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

export default SFZJLX;
