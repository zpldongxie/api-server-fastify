/* eslint-disable new-cap */
/*
 * @description: 用户组
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2021-02-03 11:11:29
 * @LastEditors: zpl
 */
// const sequelize = require('../connect');
const { Model, DataTypes } = require('sequelize');

/**
 * 用户组
 *
 * @class UserGroup
 * @extends {Model}
 */
class UserGroup extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof UserGroup
   */
  static initNow(sequelize) {
    UserGroup.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '名称',
      },
      tag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '分组英文标记，可用于前台判断身份',
      },
      desc: {
        type: DataTypes.STRING,
        comment: '描述',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        comment: '排序值',
      },
    }, {
      sequelize,
      modelName: 'UserGroup',
      timestamps: false,
      comment: '用户组',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof UserGroup
   */
  static reateAssociation(sequelize) {
    // 用户组 - 用户， 多对多
    UserGroup.belongsToMany(sequelize.models['User'], { through: 'UserGroupUser' });
  }
}

module.exports = UserGroup;
