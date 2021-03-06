/*
 * @description: 等级评定申请表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-03-23 15:09:40
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

const { processStatus } = require('../../../dictionary');

/**
 * 等级评定申请
 *
 * @class EvaluationRequest
 * @extends {Model}
 */
class EvaluationRequest extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof EvaluationRequest
   */
  static initNow(sequelize) {
    EvaluationRequest.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '申请级别',
      },
      requestType: {
        type: DataTypes.ENUM,
        values: ['初次申请', '级别变更'],
        defaultValue: '初次申请',
        allowNull: false,
        comment: '申请类型',
      },
      nature: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '机构资质',
      },
      processStatus: {
        type: DataTypes.ENUM,
        values: [
          processStatus.toSubmit,
          processStatus.pendingPayment,
          processStatus.underReview,
          processStatus.rejected,
          processStatus.finished,
        ],
        allowNull: false,
        comment: '流程状态',
      },
    }, {
      sequelize,
      modelName: 'EvaluationRequest',
      comment: '等级评定申请',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof EvaluationRequest
   */
  static reateAssociation(sequelize) {
    // 等级评定申请 - 用户， 多对一
    EvaluationRequest.belongsTo(sequelize.models['User']);

    // 等级评定申请 - 服务类别， 多对多
    EvaluationRequest.belongsToMany(sequelize.models['ServiceType'], { through: 'ServiceTypeEvaReq' });

    // 等级评定申请 - 合同， 多对一
    EvaluationRequest.belongsTo(sequelize.models['Contract']);

    // 等级评定申请 - 等级评定审批， 一对多
    EvaluationRequest.hasMany(sequelize.models['EvaluationApproval']);

    // 等级评定申请 - 证书颁发， 一对多
    EvaluationRequest.hasMany(sequelize.models['CertificateIssuing']);

    // 等级评定申请 - 申请详情， 一对一
    EvaluationRequest.hasOne(sequelize.models['RequestDetail']);

    // 等级评定申请 - 人员素质信息， 一对一
    EvaluationRequest.hasOne(sequelize.models['PersonalQuality']);

    // 等级评定申请 - 管理体系建设情况， 一对多
    EvaluationRequest.hasMany(sequelize.models['MSConstruction']);

    // 等级评定申请 - 公司业绩， 一对一
    EvaluationRequest.hasOne(sequelize.models['CompanyPerformance']);

    // 等级评定申请 - 自主开发产品， 一对多
    EvaluationRequest.hasMany(sequelize.models['SelfProduct']);

    // 等级评定申请 - 安全服务工具， 一对多
    EvaluationRequest.hasMany(sequelize.models['SafeTool']);

    // 等级评定申请 - 工作环境设施， 一对多
    EvaluationRequest.hasMany(sequelize.models['WorkingEnvironment']);

    // 等级评定申请 - 服务渠道， 一对多
    EvaluationRequest.hasMany(sequelize.models['ServiceChannel']);

    // 等级评定申请 - 上传记录， 一对多
    EvaluationRequest.hasMany(sequelize.models['UploadRecord']);
  }
}

module.exports = EvaluationRequest;
