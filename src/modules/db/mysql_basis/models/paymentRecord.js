/*
 * @description: 付款记录表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:45:08
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 付款记录
 *
 * @class PaymentRecord
 * @extends {Model}
 */
class PaymentRecord extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof PaymentRecord
   */
  static initNow(sequelize) {
    PaymentRecord.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: '付款金额',
      },
      payDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '付款时间',
      },
      voucher: {
        type: DataTypes.STRING,
        comment: '付款凭证',
      },
    }, {
      sequelize,
      modelName: 'PaymentRecord',
      comment: '付款记录',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof PaymentRecord
   */
  static reateAssociation(sequelize) {
    // 付款记录 - 合同， 多对一
    PaymentRecord.belongsTo(sequelize.models['Contract']);
  }
}

module.exports = PaymentRecord;
