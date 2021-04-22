/*
 * @description: 户口类别代码
 * @author: zpl
 * @Date: 2021-04-22 13:19:48
 * @LastEditTime: 2021-04-22 13:22:25
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/hklb.js'
import data from './initData/hklb.js'

const { Model } = Sequelize

class HKLB extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "hklb",
      sequelize,
      timestamps: false,
      comment: '户口类别代码',
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

export default HKLB;