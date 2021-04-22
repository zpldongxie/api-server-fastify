/*
 * @description: 任课学段代码
 * @author: zpl
 * @Date: 2021-04-22 14:05:02
 * @LastEditTime: 2021-04-22 14:06:49
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/rkxd.js'
import data from './initData/rkxd.js'

const { Model } = Sequelize

class RKXD extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "rkxd",
      sequelize,
      timestamps: false,
      comment: '任课学段代码',
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

export default RKXD;