/*
 * @description: 服务类别表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:45:19
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 服务类别
 *
 * @class ServiceType
 * @extends {Model}
 */
class ServiceType extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceType
   */
  static initNow(sequelize) {
    ServiceType.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        comment: '名称',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
    }, {
      sequelize,
      modelName: 'ServiceType',
      comment: '服务类别',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ServiceType
   */
  static reateAssociation(sequelize) {
    // 服务类别 - 等级评定， 一对多
    ServiceType.hasMany(sequelize.models['Evaluation']);

    // 服务类别 - 证书信息， 一对多
    ServiceType.hasMany(sequelize.models['CertificateInformation']);

    // 服务类别 - 等级评定申请， 多对多
    ServiceType.belongsToMany(sequelize.models['EvaluationRequest'], { through: 'ServiceTypeEvaReq' });
  }
}

module.exports = ServiceType;
