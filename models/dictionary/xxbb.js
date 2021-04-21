/*
 * @description: 学校办别代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-21 16:20:25
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xxbb.js'
import data from './initData/xxbb.js'

const { Model } = Sequelize

class XXBB extends Model {
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
      tableName: "xxbb",
      sequelize,
      comment: '学校办别代码',
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

export default XXBB;
