/*
 * @description: 是否标志代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-21 16:27:38
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/sfbz.js'
import data from './initData/sfbz.js'

const { Model } = Sequelize

class SFBZ extends Model {
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
      tableName: "sfbz",
      sequelize,
      comment: '是否标志代码',
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

export default SFBZ;
