/* eslint-disable new-cap */
/*
 * @description: 栏目-文章关联表，只用于自动创建数据库表
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-01 01:12:03
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 栏目-文章关联表
   *
   * @class ChannelAtricle
   * @extends {Model}
   */
class ChannelAtricle extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelAtricle
   */
  static initNow(sequelize) {
    ChannelAtricle.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'ChannelAtricle',
      comment: '栏目-文章关联表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelAtricle
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = ChannelAtricle;
