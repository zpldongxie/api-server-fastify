/*
 * @description: 部门类别
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2021-03-11 17:30:21
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 部门类别
 *
 * @class DepTag
 * @extends {Model}
 */
class DepTag extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof DepTag
   */
  static initNow(sequelize) {
    DepTag.init({
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
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
    }, {
      sequelize,
      modelName: 'DepTag',
      timestamps: false,
      comment: '部门类别',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof DepTag
   */
  static reateAssociation(sequelize) {
    // 部门类别 - 部门， 一对多
    DepTag.hasMany(sequelize.models['Department']);

    // 部门类别 - 权限， 一对多
    DepTag.hasMany(sequelize.models['Jurisdiction']);
  }
}

module.exports = DepTag;
