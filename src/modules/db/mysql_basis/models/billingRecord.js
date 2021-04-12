/*
 * @description: 开票记录表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:43:42
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 开票记录
 *
 * @class BillingRecord
 * @extends {Model}
 */
class BillingRecord extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof BillingRecord
   */
  static initNow(sequelize) {
    BillingRecord.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: '开票金额',
      },
      billingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '开票时间',
      },
      voucher: {
        type: DataTypes.STRING,
        comment: '开票凭证',
      },
    }, {
      sequelize,
      modelName: 'BillingRecord',
      comment: '开票记录',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof BillingRecord
   */
  static reateAssociation(sequelize) {
    // 开票记录 - 合同， 多对一
    BillingRecord.belongsTo(sequelize.models['Contract']);
  }
}

module.exports = BillingRecord;
