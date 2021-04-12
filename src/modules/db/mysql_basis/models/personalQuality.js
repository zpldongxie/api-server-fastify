/*
 * @description: 人员素质信息
 * @author: zpl
 * @Date: 2021-03-11 16:26:31
 * @LastEditTime: 2021-03-11 16:38:35
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 人员素质信息
 *
 * @class PersonalQuality
 * @extends {Model}
 */
class PersonalQuality extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof PersonalQuality
   */
  static initNow(sequelize) {
    PersonalQuality.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalCo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '企业总人数',
      },
      leaderAgeLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '负责人从事信息技术管理年限',
      },
      techLeaderName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '技术负责人姓名',
      },
      techLeaderMajor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '技术负责人专业',
      },
      techLeaderTitle: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '技术负责人职称',
      },
      techLeaderAgeLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '技术负责人从事信息技术工作年限',
      },
      financeLeaderName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '财务负责人姓名',
      },
      financeLeaderMajor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '财务负责人专业',
      },
      financeLeaderTitleAges: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '财务负责人获得职称时间',
      },
      totalSecurity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '安全服务人员总人数',
      },
      undergraduateNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '安全服务人员本科学历人数',
      },
      undergraduateShare: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '安全服务人员本科占专业技术人员比例',
      },
      masterNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '安全服务人员硕士学历人数',
      },
      masterShare: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '安全服务人员硕士占专业技术人员比例',
      },
      doctorNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '安全服务人员博士学历及以上人数',
      },
      doctorShare: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '安全服务人员博士学历及以上占专业技术人员比例',
      },
      technicianNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '网络安全专业技术员人数',
      },
    }, {
      sequelize,
      modelName: 'PersonalQuality',
      comment: '人员素质信息',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof PersonalQuality
   */
  static reateAssociation(sequelize) {
    // 人员素质信息 - 用户， 一对一
    PersonalQuality.belongsTo(sequelize.models['User']);

    // 人员素质信息 - 等级评定申请， 一对一
    PersonalQuality.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = PersonalQuality;
