/*
 * @description: 证书颁发信息表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:44:15
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 证书颁发信息
 *
 * @class CertificateIssuing
 * @extends {Model}
 */
class CertificateIssuing extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof CertificateIssuing
   */
  static initNow(sequelize) {
    CertificateIssuing.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      companyName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '单位名称',
      },
      certificateNu: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '证书编号',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '证书级别',
      },
      timeOfIssue: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '颁发时间',
      },
      certificateFile: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '证书文件',
      },
    }, {
      sequelize,
      modelName: 'CertificateIssuing',
      comment: '证书颁发信息',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof CertificateIssuing
   */
  static reateAssociation(sequelize) {
    // 证书颁发信息 - 等级评定， 一对一
    CertificateIssuing.hasOne(sequelize.models['Evaluation']);

    // 证书颁发信息 - 等级评定申请， 多对一
    CertificateIssuing.belongsTo(sequelize.models['EvaluationRequest']);

    // 证书颁发信息 - 证书信息， 多对一
    CertificateIssuing.belongsTo(sequelize.models['CertificateInformation']);
  }
}

module.exports = CertificateIssuing;
