/*
 * @description: 其他成果表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:13:22
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 其他成果表
 *
 * @class OtherResult
 * @extends {Model}
 */
class OtherResult extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof OtherResult
   */
  static initNow(sequelize) {
    OtherResult.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
    }, {
      sequelize,
      comment: '其他成果表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof OtherResult
   */
  static reateAssociation(sequelize) {
    OtherResult.belongsTo(sequelize.models['User']);
  }
}

module.exports = OtherResult;
