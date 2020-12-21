/*
 * @description: 支撑材料表
 * @author: zpl
 * @Date: 2020-12-18 16:47:36
 * @LastEditTime: 2020-12-21 10:14:23
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 支撑材料表
 *
 * @class SupportingDoc
 * @extends {Model}
 */
class SupportingDoc extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof SupportingDoc
   */
  static initNow(sequelize) {
    SupportingDoc.init({
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: '标题',
      },
    }, {
      sequelize,
      comment: '支撑材料表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof SupportingDoc
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = SupportingDoc;
