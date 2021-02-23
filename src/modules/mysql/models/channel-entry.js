/* eslint-disable new-cap */
/*
 * @description: 栏目-入驻名录关联表，只用于自动创建数据库表
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-20 16:24:44
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 栏目-文章关联表
   *
   * @class ChannelEntry
   * @extends {Model}
   */
class ChannelEntry extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelEntry
   */
  static initNow(sequelize) {
    ChannelEntry.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'ChannelEntry',
      comment: '栏目-入驻名录关联表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelEntry
   */
  static reateAssociation(sequelize) {
  }
}

module.exports = ChannelEntry;
