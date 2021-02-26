/*
 * @description: 权限
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-24 16:24:31
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 权限
 *
 * @class Jurisdiction
 * @extends {Model}
 */
class Jurisdiction extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Jurisdiction
   */
  static initNow(sequelize) {
    Jurisdiction.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      canRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否可读',
      },
      canWrite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否可写',
      },
    }, {
      sequelize,
      modelName: 'Jurisdiction',
      timestamps: false,
      comment: '权限',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Jurisdiction
   */
  static reateAssociation(sequelize) {
    // 权限 - 功能模块， 多对一
    Jurisdiction.belongsTo(sequelize.models['Modular'], { through: 'ModularJurisdiction' });

    // 权限 - 部门， 多对一
    Jurisdiction.belongsTo(sequelize.models['Department']);
  }
}

module.exports = Jurisdiction;
