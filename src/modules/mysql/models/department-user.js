/*
 * @description: 部门-用户关联表，只用于自动创建数据库表
 * @author: zpl
 * @Date: 2021-02-24 14:32:35
 * @LastEditTime: 2021-02-24 14:37:02
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 部门-用户关联表
   *
   * @class DepartmentUser
   * @extends {Model}
   */
class DepartmentUser extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof DepartmentUser
   */
  static initNow(sequelize) {
    DepartmentUser.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'DepartmentUser',
      comment: '部门-用户关联表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof DepartmentUser
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = DepartmentUser;
