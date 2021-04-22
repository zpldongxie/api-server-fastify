/*
 * @description: 健康状况代码(2位数字代码)
 * @author: zpl
 * @Date: 2021-04-22 11:12:19
 * @LastEditTime: 2021-04-22 11:14:10
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/jkzk2.js'
import data from './initData/jkzk2.js'

const { Model } = Sequelize

class JKZK2 extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "jkzk2",
      sequelize,
      timestamps: false,
      comment: '健康状况代码(2位数字代码)',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getId(where) {
    return this.findOne({
      where,
      attributes: ["id"],
    });
  }

  static async initData() {
    await this.destroy({ where: {} })
    await this.bulkCreate(data)
  }

  toJSON() {
    return {
      id: this.id,
      dmlb: this.dmlb,
      dm: this.dm,
      dmhy: this.dmhy,
      dmsm: this.dmsm,
    }
  }
}

export default JKZK2;