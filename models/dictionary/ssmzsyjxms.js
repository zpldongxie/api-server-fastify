/*
 * @description: 少数民族双语教学模式代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-21 17:14:42
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/ssmzsyjxms.js'
import data from './initData/ssmzsyjxms.js'

const { Model } = Sequelize

class SSMZSYJXMS extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "ssmzsyjxms",
      sequelize,
      timestamps: false,
      comment: '少数民族双语教学模式代码',
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

export default SSMZSYJXMS;