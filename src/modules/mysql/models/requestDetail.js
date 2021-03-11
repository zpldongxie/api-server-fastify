/*
 * @description: 申请详情表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-03-11 17:03:09
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 申请详情
 *
 * @class RequestDetail
 * @extends {Model}
 */
class RequestDetail extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof RequestDetail
   */
  static initNow(sequelize) {
    RequestDetail.init({
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
      department: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '所属/主管部门',
      },
      detailed: {
        type: DataTypes.STRING,
        comment: '详细',
      },
      communication: {
        type: DataTypes.STRING(20),
        comment: '通信',
      },
      postcode: {
        type: DataTypes.STRING(6),
        comment: '邮编',
      },
      legalPerson: {
        type: DataTypes.STRING(20),
        comment: '法人',
      },
      legalPersonTel: {
        type: DataTypes.STRING(15),
        comment: '法人电话',
      },
      legalPersonMobile: {
        type: DataTypes.STRING(11),
        comment: '法人手机',
      },
      legalPersonFax: {
        type: DataTypes.STRING(20),
        is: /^([0-9]{2,3}-)?([0-9]{3,4}-)?([0-9]{7,8})$/i,
        comment: '法人传真',
      },
      legalPersonEmail: {
        type: DataTypes.STRING(64),
        comment: '法人邮箱',
      },
      contact: {
        type: DataTypes.STRING(20),
        comment: '联系人',
      },
      contactTel: {
        type: DataTypes.STRING(15),
        comment: '联系人电话',
      },
      contactMobile: {
        type: DataTypes.STRING(11),
        comment: '联系人手机',
      },
      contactFax: {
        type: DataTypes.STRING(20),
        is: /^([0-9]{2,3}-)?([0-9]{3,4}-)?([0-9]{7,8})$/i,
        comment: '联系人传真',
      },
      contactEmail: {
        type: DataTypes.STRING(64),
        comment: '联系人邮箱',
      },
      registrationNu: {
        type: DataTypes.STRING(64),
        comment: '注册号',
      },
      registeredCapital: {
        type: DataTypes.STRING(64),
        comment: '注册资本',
      },
      established: {
        type: DataTypes.DATE,
        comment: '成立时间',
      },
      typeOfEnterprise: {
        type: DataTypes.STRING(20),
        comment: '企业类型',
      },
      businessScope: {
        type: DataTypes.STRING(100),
        comment: '经营范围',
      },
      shareholder: {
        type: DataTypes.STRING,
        comment: '主要股东，数组，以逗号隔开',
      },
      ratioOfShareholders: {
        type: DataTypes.STRING,
        comment: '股东持股比例，数组，与主要股东对应',
      },
      percentageOfChinese: {
        type: DataTypes.STRING,
        comment: '中国公民或组织持股比例',
      },
      businessLicense: {
        type: DataTypes.STRING,
        comment: '营业执照副本',
      },
      planning: {
        type: DataTypes.STRING,
        comment: '简介/规划',
      },
      workplace: {
        type: DataTypes.STRING,
        comment: '办公场所',
      },
      auditReport: {
        type: DataTypes.STRING,
        comment: '近二年审计报告',
      },
      letterOfCommitment: {
        type: DataTypes.STRING,
        comment: '承诺函',
      },
      certificate: {
        type: DataTypes.STRING,
        comment: '学历、职称、安全培训证书复印件',
      },
      personnelSituation: {
        type: DataTypes.STRING,
        comment: '安全服务人员基本情况',
      },
      undertakeTheContract: {
        type: DataTypes.STRING,
        comment: '项目承接合同复印件',
      },
      enterpriseAwards: {
        type: DataTypes.STRING,
        comment: '企业获奖',
      },
      humanResources: {
        type: DataTypes.STRING,
        comment: '人力资源',
      },
      confidentialityManagement: {
        type: DataTypes.STRING,
        comment: '保密管理制度',
      },
      projectManagement: {
        type: DataTypes.STRING,
        comment: '项目管理制度',
      },
      projectDocumentation: {
        type: DataTypes.STRING,
        comment: '项目过程文档',
      },
    }, {
      sequelize,
      modelName: 'RequestDetail',
      comment: '申请详情',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof RequestDetail
   */
  static reateAssociation(sequelize) {
    // 等级评定申请 - 申请详情， 一对一
    RequestDetail.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = RequestDetail;
