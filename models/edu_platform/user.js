/*
 * @description: 用户
 * @author: zpl
 * @Date: 2021-04-20 16:46:36
 * @LastEditTime: 2021-04-21 11:47:25
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import crypto from 'crypto'
import getSchema from './schemas/user.js'

import data from './initData/user.js'

const { Model } = Sequelize

class User extends Model {
  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @param {*} XXDM 学校代码
   * @param {*} HMAC_KEY 加密KEY
   * @return {*} 
   * @memberof User
   */
   static init(sequelize, XXDM, HMAC_KEY) {
    return super.init(getSchema(XXDM, HMAC_KEY), {
      tableName: "user",
      sequelize,
      comment: '用户', 
    })
  }

  static associate(models) {
    //No asociations
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }

  /**
   * 验证用户名密码
   *
   * @static
   * @param {*} loginName
   * @param {*} password
   * @param {*} HMAC_KEY 加密KEY
   * @return {*} 
   * @memberof User
   */
   static getUsernameAndPassword(loginName, password, HMAC_KEY) {
    const pwd = crypto.createHmac('sha1', HMAC_KEY).update(password).digest('hex');
    console.log(HMAC_KEY);
    console.log(pwd);
    return this.findOne({
      where: {
        loginName,
        password: pwd
      }
    });
  }

  /**
   * 初始化管理员账号
   *
   * @static
   * @memberof User
   */
  static async initAdmin() {
    await this.destroy({ where: {} })
    await this.bulkCreate(data)
  }
}

export default User;
