/*
 * @description: 工作环境设施
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-03-18 16:31:29
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 工作环境设施
 *
 * @class WorkingEnvironment
 * @extends {Model}
 */
class WorkingEnvironment extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof WorkingEnvironment
   */
  static initNow(sequelize) {
    WorkingEnvironment.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '分类',
      },
      model: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '型号',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '数量',
      },
    }, {
      sequelize,
      modelName: 'WorkingEnvironment',
      timestamps: false,
      comment: '工作环境设施',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof WorkingEnvironment
   */
  static reateAssociation(sequelize) {
    // 工作环境设施 - 用户， 多对一
    WorkingEnvironment.belongsTo(sequelize.models['User']);

    // 工作环境设施 - 等级评定申请， 多对一
    WorkingEnvironment.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = WorkingEnvironment;
