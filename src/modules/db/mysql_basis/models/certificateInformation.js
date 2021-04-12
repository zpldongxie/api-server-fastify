/*
 * @description: 证书信息表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:43:50
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 证书信息
 *
 * @class CertificateInformation
 * @extends {Model}
 */
class CertificateInformation extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof CertificateInformation
   */
  static initNow(sequelize) {
    CertificateInformation.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        comment: '证书名称',
      },
      templat: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '模板文件',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
    }, {
      sequelize,
      modelName: 'CertificateInformation',
      comment: '证书信息',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof CertificateInformation
   */
  static reateAssociation(sequelize) {
    // 证书信息 - 服务类别， 多对一
    CertificateInformation.belongsTo(sequelize.models['ServiceType']);

    // 证书信息 - 证书颁发信息， 一对多
    CertificateInformation.hasMany(sequelize.models['CertificateIssuing']);
  }
}

module.exports = CertificateInformation;
