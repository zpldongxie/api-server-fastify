/*
 * @description: 学制代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 15:58:04
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xz.js'
import data from './initData/xz.js'

const { Model } = Sequelize

class XZ extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "xz",
      sequelize,
      timestamps: false,
      comment: '学制代码',
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
      syxx: this.syxx,
    }
  }
}

export default XZ;