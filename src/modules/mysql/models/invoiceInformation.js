/*
 * @description: 发票信息表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:43:17
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 发票信息
 *
 * @class InvoiceInformation
 * @extends {Model}
 */
class InvoiceInformation extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof InvoiceInformation
   */
  static initNow(sequelize) {
    InvoiceInformation.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      InvoiceType: {
        type: DataTypes.ENUM,
        values: ['普票', '专票'],
        defaultValue: '普票',
        comment: '发票类型',
      },
      InvoiceTitle: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '发票抬头',
      },
      bankName: {
        type: DataTypes.STRING(64),
        comment: '开户银行',
      },
      accountNumber: {
        type: DataTypes.STRING(64),
        comment: '开户账号',
      },
      address: {
        type: DataTypes.STRING(100),
        comment: '公司注册地址',
      },
      tel: {
        type: DataTypes.STRING(15),
        comment: '公司注册电话',
      },
    }, {
      sequelize,
      modelName: 'InvoiceInformation',
      comment: '发票信息',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof InvoiceInformation
   */
  static reateAssociation(sequelize) {
    // 发票信息 - 用户， 一对一
    InvoiceInformation.belongsTo(sequelize.models['User']);
  }
}

module.exports = InvoiceInformation;
