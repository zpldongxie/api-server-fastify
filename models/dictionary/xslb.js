/*
 * @description: 学生类别类型
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-22 13:12:55
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xslb.js'
import data from './initData/xslb.js'

const { Model } = Sequelize

class XSLB extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "xslb",
      sequelize,
      timestamps: false,
      comment: '学生类别类型',
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

export default XSLB;