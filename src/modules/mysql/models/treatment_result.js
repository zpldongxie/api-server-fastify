/*
 * @description: 待遇兑现表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:15:04
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 待遇兑现表
 *
 * @class TmtResult
 * @extends {Model}
 */
class TmtResult extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof TmtResult
   */
  static initNow(sequelize) {
    TmtResult.init({
      num: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '待遇兑现表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof TmtResult
   */
  static reateAssociation(sequelize) {
    TmtResult.belongsTo(sequelize.models['User']);
  }
}

module.exports = TmtResult;
