/*
 * @description: 用户
 * @author: zpl
 * @Date: 2020-07-25 15:10:09
 * @LastEditTime: 2020-07-27 10:35:21
 * @LastEditors: zpl
 */
const {Model, DataTypes} = require('sequelize');

/**
 * 用户
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {}

exports.User = User;
module.exports = (sequelize) => {
  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    loginName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(64),
      is: /^[0-9a-f]{64}$/i,
    },
    name: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(64),
      comment: '姓名',
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      comment: '性别',
      values: ['男', '女'],
    },
    mobile: {
      type: DataTypes.STRING,
      comment: '手机',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '邮箱',
    },
    remark: {
      type: DataTypes.STRING,
      comment: '备注',
    },
    verification_code: {
      type: DataTypes.STRING,
      comment: '验证码',
    },
    status: {
      type: DataTypes.INTEGER,
      comment: '状态,1为启用，0为未启用',
    },
    // TODO: 等完全从java后台切换过来后，这两个属性要移除
    last_edit_time: {
      type: DataTypes.STRING,
    },
    create_time: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
  });

  return User;
};
