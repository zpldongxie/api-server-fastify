/*
 * @description: 岗位职业代码
 * @author: zpl
 * @Date: 2021-04-22 13:59:28
 * @LastEditTime: 2021-04-22 14:00:31
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/gwzy.js'
import data from './initData/gwzy.js'

const { Model } = Sequelize

class GWZY extends Model {
  static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "gwzy",
      sequelize,
      timestamps: false,
      comment: '岗位职业代码',
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

export default GWZY;