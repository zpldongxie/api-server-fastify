/*
 * @description: 中小学班级类型
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 17:05:10
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zxxbjlx.js'
import data from './initData/zxxbjlx.js'

const { Model } = Sequelize

class ZXXBJLX extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "zxxbjlx",
      sequelize,
      timestamps: false,
      comment: '中小学班级类型',
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

export default ZXXBJLX;