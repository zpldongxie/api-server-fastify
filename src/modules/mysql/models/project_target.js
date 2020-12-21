/*
 * @description: 项目目标表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:14:11
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 项目目标表
 *
 * @class ProjectTarget
 * @extends {Model}
 */
class ProjectTarget extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ProjectTarget
   */
  static initNow(sequelize) {
    ProjectTarget.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '项目目标表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ProjectTarget
   */
  static reateAssociation(sequelize) {
    ProjectTarget.belongsTo(sequelize.models['User']);
  }
}

module.exports = ProjectTarget;
