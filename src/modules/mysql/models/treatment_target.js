/*
 * @description: 待遇协议表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:15:19
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 待遇协议表
 *
 * @class TmtTarget
 * @extends {Model}
 */
class TmtTarget extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof TmtTarget
   */
  static initNow(sequelize) {
    TmtTarget.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '待遇协议表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof TmtTarget
   */
  static reateAssociation(sequelize) {
    TmtTarget.belongsTo(sequelize.models['User']);
  }
}

module.exports = TmtTarget;
