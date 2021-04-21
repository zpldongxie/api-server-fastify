/*
 * @description: 中国语种代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 16:20:36
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zgyz.js'
import data from './initData/zgyz.js'

const { Model } = Sequelize

class ZGYZ extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "zgyz",
      sequelize,
      timestamps: false,
      comment: '中国语种代码',
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

export default ZGYZ;