/*
 * @description: 中华人民共和国行政区划代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 15:58:40
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/xzqh.js'
import data from './initData/xzqh.js'

const { Model } = Sequelize

class XZQH extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "xzqh",
      sequelize,
      timestamps: false,
      comment: '中华人民共和国行政区划代码',
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
    const list = data.map(d => ({
      lx: d[0],
      dm: d[1],
      mc: d[2]
    }))
    await this.bulkCreate(list)
  }

  toJSON() {
    return {
      id: this.id,
      lx: this.lx,
      dm: this.dm,
      mc: this.mc,
    }
  }
}

export default XZQH;