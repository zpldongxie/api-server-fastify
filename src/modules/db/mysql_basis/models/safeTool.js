/*
 * @description: 安全服务工具
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-25 14:12:08
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 安全服务工具
 *
 * @class SafeTool
 * @extends {Model}
 */
class SafeTool extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof SafeTool
   */
  static initNow(sequelize) {
    SafeTool.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '名称',
      },
      descStr: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '功能描述',
      },
      version: {
        type: DataTypes.STRING(20),
        comment: '版本',
      },
      provider: {
        type: DataTypes.STRING(50),
        comment: '提供商',
      },
    }, {
      sequelize,
      modelName: 'SafeTool',
      timestamps: false,
      comment: '安全服务工具',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof SafeTool
   */
  static reateAssociation(sequelize) {
    // 安全服务工具 - 用户， 多对一
    SafeTool.belongsTo(sequelize.models['User']);

    // 安全服务工具 - 等级评定申请， 多对一
    SafeTool.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = SafeTool;
