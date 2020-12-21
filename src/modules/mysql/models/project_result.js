/*
 * @description: 项目成果表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:13:57
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 项目成果表
 *
 * @class ProjectResult
 * @extends {Model}
 */
class ProjectResult extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ProjectResult
   */
  static initNow(sequelize) {
    ProjectResult.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '项目成果表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ProjectResult
   */
  static reateAssociation(sequelize) {
    ProjectResult.belongsTo(sequelize.models['User']);
  }
}

module.exports = ProjectResult;
