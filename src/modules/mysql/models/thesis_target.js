/*
 * @description: 论文目标表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:14:50
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 论文目标表
 *
 * @class ThesisTarget
 * @extends {Model}
 */
class ThesisTarget extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ThesisTarget
   */
  static initNow(sequelize) {
    ThesisTarget.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '论文目标表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ThesisTarget
   */
  static reateAssociation(sequelize) {
    ThesisTarget.belongsTo(sequelize.models['User']);
  }
}

module.exports = ThesisTarget;
