/*
 * @description: 合同表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:44:34
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 合同
 *
 * @class Contract
 * @extends {Model}
 */
class Contract extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Contract
   */
  static initNow(sequelize) {
    Contract.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '合同名称',
      },
      number: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        comment: '合同编号',
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: '合同额',
      },
      dateOfSigning: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '签署日期',
      },
      archive: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '归档文件',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
    }, {
      sequelize,
      modelName: 'Contract',
      comment: '合同',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Contract
   */
  static reateAssociation(sequelize) {
    // 合同 - 等级评定申请， 一对多
    Contract.hasMany(sequelize.models['EvaluationRequest']);

    // 合同 - 付款记录， 一对多
    Contract.hasMany(sequelize.models['PaymentRecord']);

    // 合同 - 开票记录， 一对多
    Contract.hasMany(sequelize.models['BillingRecord']);
  }
}

module.exports = Contract;
