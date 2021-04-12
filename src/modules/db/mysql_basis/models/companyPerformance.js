/*
 * @description:
 * @author: zpl
 * @Date: 2021-03-11 16:48:31
 * @LastEditTime: 2021-03-11 17:19:54
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 公司业绩
 *
 * @class CompanyPerformance
 * @extends {Model}
 */
class CompanyPerformance extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof CompanyPerformance
   */
  static initNow(sequelize) {
    CompanyPerformance.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programsNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '完成安全服务项目数',
      },
      totalAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: '合同金额合计',
      },
      sameProgramsNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '完成与申报类别一致的服务项目数',
      },
      sameAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: '类别一致合同金额合计',
      },
      sameSingleProgramNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '与申报类别一致的单个服务项目数',
      },
    }, {
      sequelize,
      modelName: 'CompanyPerformance',
      comment: '公司业绩',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof CompanyPerformance
   */
  static reateAssociation(sequelize) {
    // 公司业绩 - 等级评定申请， 一对一
    CompanyPerformance.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = CompanyPerformance;
