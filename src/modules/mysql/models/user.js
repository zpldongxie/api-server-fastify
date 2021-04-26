/* eslint-disable new-cap */
/*
 * @description: 用户
 * @author: zpl
 * @Date: 2020-07-25 15:10:09
 * @LastEditTime: 2021-04-26 10:12:28
 * @LastEditors: zpl
 */
const crypto = require('crypto');
const config = require('config');
const { Model, DataTypes } = require('sequelize');

const HMAC_KEY = config.get('HMAC_KEY');

/**
 * 用户
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof User
   */
  static initNow(sequelize) {
    User.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      loginName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '登录名',
      },
      password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
        comment: '密码',
        set(value) {
          this.setDataValue('password', crypto.createHmac('sha1', HMAC_KEY).update(value).digest('hex'));
        },
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '姓名',
      },
      sex: {
        type: DataTypes.ENUM,
        values: ['男', '女'],
        comment: '性别',
      },
      mobile: {
        type: DataTypes.STRING(11),
        comment: '手机',
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '邮箱',
      },
      remark: {
        type: DataTypes.STRING,
        comment: '备注',
      },
      verificationCode: {
        type: DataTypes.STRING(20),
        comment: '验证码',
      },
      status: {
        type: DataTypes.INTEGER,
        comment: '状态,1为启用，0为未启用',
      },
    }, {
      sequelize,
      modelName: 'User',
      comment: '用户',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof User
   */
  static reateAssociation(sequelize) {
    // 用户 - 用户组， 多对多
    User.belongsToMany(sequelize.models['UserGroup'], { through: 'UserGroupUser' });
  }
}

module.exports = User;
