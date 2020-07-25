/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-25 15:10:09
 * @LastEditTime: 2020-07-25 16:27:27
 * @LastEditors: zpl
 */
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize, dbName) => {
  /**
   * 用户表
   *
   * @class User
   * @extends {Model}
   */
  class User extends Model {}

  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      comment: '姓名',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM,
      comment: '性别',
      values: ['男', '女'],
    },
    mobile: {
      type: DataTypes.STRING,
      comment: '手机',
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      comment: '邮箱',
    },
    remark: {
      type: DataTypes.STRING,
      comment: '?',
    },
    verification_code: {
      type: DataTypes.STRING,
      comment: '验证码？',
    },
    status: {
      type: DataTypes.INTEGER,
      comment: '?',
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    createdAt: 'create_time',
    updatedAt: 'last_edit_time',
  });

  User.sync({match: new RegExp('^' + dbName + '$')});

  return User;
};


