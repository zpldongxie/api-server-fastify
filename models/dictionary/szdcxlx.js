/*
 * @description: 所在地城乡类型代码
 * @author: zpl
 * @Date: 2021-04-21 15:0:33
 * @LastEditTime: 2021-04-21 16:33:01
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import getSchema from './schemas/szdcxlx.js'
import data from './initData/szdcxlx.js'

const { Model } = Sequelize

class SZDCXLX extends Model {
  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @return {*} 
   * @memberof User
   */
   static init(sequelize) {
    return super.init(getSchema(), {
      tableName: "szdcxlx",
      sequelize,
      comment: '所在地城乡类型代码',
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }

  static async initData() {
      await this.destroy({ where: {} })
      await this.bulkCreate(data)
  }
}

export default SZDCXLX;
