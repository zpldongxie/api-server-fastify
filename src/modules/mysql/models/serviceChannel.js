/*
 * @description: 服务渠道表
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-25 14:25:25
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 服务渠道表
 *
 * @class ServiceChannel
 * @extends {Model}
 */
class ServiceChannel extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceChannel
   */
  static initNow(sequelize) {
    ServiceChannel.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      website: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '类别',
      },
      office: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '具体内容',
      },
    }, {
      sequelize,
      modelName: 'ServiceChannel',
      timestamps: false,
      comment: '服务渠道表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceChannel
   */
  static reateAssociation(sequelize) {
    // 服务渠道表 - 用户， 多对一
    ServiceChannel.belongsTo(sequelize.models['User']);

    // 服务渠道表 - 等级评定申请， 多对一
    ServiceChannel.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = ServiceChannel;
