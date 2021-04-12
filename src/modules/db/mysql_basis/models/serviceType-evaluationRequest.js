/*
 * @description: 服务类别 - 等级评定申请关联表，只用于自动创建数据库表
 * @author: zpl
 * @Date: 2021-02-24 14:32:35
 * @LastEditTime: 2021-02-25 15:22:35
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 服务类别 - 等级评定申请关联表
   *
   * @class ServiceTypeEvaReq
   * @extends {Model}
   */
class ServiceTypeEvaReq extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceTypeEvaReq
   */
  static initNow(sequelize) {
    ServiceTypeEvaReq.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'ServiceTypeEvaReq',
      comment: '服务类别 - 等级评定申请关联表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceTypeEvaReq
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = ServiceTypeEvaReq;
