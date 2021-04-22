/*
 * @description: 中小学课程代码
 * @author: zpl
 * @Date: 2021-04-22 13:51:56
 * @LastEditTime: 2021-04-22 13:53:50
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zxxkc.js'
import data from './initData/zxxkc.js'

const { Model } = Sequelize

class ZXXKC extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "zxxkc",
      sequelize,
      timestamps: false,
      comment: '中小学课程代码',
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

export default ZXXKC;