/* eslint-disable new-cap */
/*
 * @description: 用户组-用户关联表，只用于自动创建数据库表
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-01 01:12:11
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 用户组-用户关联表
   *
   * @class UserGroupUser
   * @extends {Model}
   */
class UserGroupUser extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof UserGroupUser
   */
  static initNow(sequelize) {
    UserGroupUser.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'UserGroupUser',
      comment: '用户组-用户关联表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof UserGroupUser
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = UserGroupUser;
