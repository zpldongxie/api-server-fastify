/*
 * @description: 所在地区经济属性代码
 * @author: zpl
 * @Date: 2021-04-21 15:13:59
 * @LastEditTime: 2021-04-21 15:15:28
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/szdqjjsx.js'
import data from './initData/szdqjjsx.js'

const { Model } = Sequelize

class SZDQJJSX extends Model {
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
      tableName: "szdqjjsx",
      sequelize,
      comment: '所在地区经济属性代码',
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

export default SZDQJJSX;
