/*
 * @description: 办学类型代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 15:58:26
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/bxlx.js'
import data from './initData/bxlx.js'

const { Model } = Sequelize

class BXLX extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "bxlx",
      sequelize,
      timestamps: false,
      comment: '办学类型代码',
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

export default BXLX;