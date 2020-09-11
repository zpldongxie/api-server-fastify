/*
 * @description: 老后台关联表，完全切换到新后台后删除
 * @author: zpl
 * @Date: 2020-07-28 10:16:12
 * @LastEditTime: 2020-09-11 21:36:41
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 文章
 *
 * @class ContentDetailChannel
 * @extends {Model}
 */
class ContentDetailChannel extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ContentDetailChannel
   */
  static initNow(sequelize) {
    ContentDetailChannel.init({
      content_detail_id: {
        type: DataTypes.BIGINT,
      },
      channel_id: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'content_detail_channel',
      tableName: 'content_detail_channel',
      timestamps: false,
      indexes: [{ unique: true, fields: ['id'] }],
    });
  }
}

module.exports = ContentDetailChannel;
