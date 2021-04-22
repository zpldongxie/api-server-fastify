/*
 * @description: 中小学编制类别代码
 * @author: zpl
 * @Date: 2021-04-22 13:51:56
 * @LastEditTime: 2021-04-22 13:52:51
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zxxbzlb.js'
import data from './initData/zxxbzlb.js'

const { Model } = Sequelize

class ZXXBZLB extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "zxxbzlb",
      sequelize,
      timestamps: false,
      comment: '中小学编制类别代码',
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

export default ZXXBZLB;