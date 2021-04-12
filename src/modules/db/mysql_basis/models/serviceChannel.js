/*
 * @description: 服务渠道表
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-03-17 14:34:20
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 服务渠道
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
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '类别',
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '具体内容',
      },
    }, {
      sequelize,
      modelName: 'ServiceChannel',
      timestamps: false,
      comment: '服务渠道',
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
    // 服务渠道 - 用户， 多对一
    ServiceChannel.belongsTo(sequelize.models['User']);

    // 服务渠道 - 等级评定申请， 多对一
    ServiceChannel.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = ServiceChannel;
