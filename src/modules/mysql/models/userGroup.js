/*
 * @description: 用户组
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2021-01-02 19:24:46
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
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '名称描述',
      },
      // 暂时不要权限表，用户分组后，具体权限交给中台控制
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '系统英文标记',
      },
    }, {
      sequelize,
      modelName: 'UserGroup',
      tableName: 'user_group',
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
    // 用户 - 用户组， 多对多
    UserGroup.belongsToMany(sequelize.models['User'], {
      through: 'user-group-user',
      foreignKey: 'user_group_id',
    });
  }
}

module.exports = UserGroup;
