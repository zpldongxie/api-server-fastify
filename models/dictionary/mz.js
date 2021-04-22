/*
 * @description: 中国各民族名称的罗马字母拼写法和代码
 * @author: zpl
 * @Date: 2021-04-21 14:56:21
 * @LastEditTime: 2021-04-21 17:41:42
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/mz.js'
import data from './initData/mz.js'

const { Model } = Sequelize

class MZ extends Model {
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
      tableName: "mz",
      sequelize,
      comment: '民族',
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

export default MZ;
