/*
 * @description: 宗教信仰代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-22 11:44:35
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/zjxy.js'
import data from './initData/zjxy.js'

const { Model } = Sequelize

class ZJXY extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "zjxy",
      sequelize,
      timestamps: false,
      comment: '宗教信仰代码',
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

export default ZJXY;