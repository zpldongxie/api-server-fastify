/*
 * @description: 用户组
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2020-07-26 23:37:08
 * @LastEditors: zpl
 */
// const sequelize = require('../connect');
const {Model, DataTypes} = require('sequelize');

/**
 * 用户组
 *
 * @class UserGroup
 * @extends {Model}
 */
class UserGroup extends Model {}

exports.UserGroup = UserGroup;

module.exports = (sequelize) => {
  UserGroup.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'UserGroup',
    tableName: 'user_group',
    timestamps: false,
  });

  // UserGroup.sync({match: new RegExp('^' + sequelize.getDatabaseName() + '$')});

  return UserGroup;
};
