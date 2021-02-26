/*
 * @description: 等级评定审批
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-25 12:50:15
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 等级评定审批
 *
 * @class EvaluationApproval
 * @extends {Model}
 */
class EvaluationApproval extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof EvaluationApproval
   */
  static initNow(sequelize) {
    EvaluationApproval.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      linkName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '环节名称',
      },
      handlingOpinions: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['通过', '不通过'],
        comment: '审批结果',
      },
      notes: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '审批意见',
      },
      approvalFiles: {
        type: DataTypes.STRING,
        comment: '审核文档',
      },
    }, {
      sequelize,
      modelName: 'EvaluationApproval',
      timestamps: false,
      comment: '等级评定审批',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof EvaluationApproval
   */
  static reateAssociation(sequelize) {
    // 等级评定审批 - 等级评定申请， 多对一
    EvaluationApproval.belongsTo(sequelize.models['EvaluationRequest']);

    // 等级评定审批 - 用户， 多对一
    EvaluationApproval.belongsTo(sequelize.models['User']);
  }
}

module.exports = EvaluationApproval;
