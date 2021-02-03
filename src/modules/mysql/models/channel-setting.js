/* eslint-disable new-cap */
/*
 * @description: 栏目配置
 * @author: zpl
 * @Date: 2020-07-28 10:42:50
 * @LastEditTime: 2021-01-30 15:22:01
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 栏目配置
 *
 * @class ChannelSetting
 * @extends {Model}
 */
class ChannelSetting extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelSetting
   */
  static initNow(sequelize) {
    ChannelSetting.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '标题',
      },
      descStr: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '内容',
      },
      pic: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '图片链接',
      },
      video: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '视频链接',
      },
      link: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '普通链接',
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '配置类型，如，pic:图片配置，url:链接配置，desc:文字配置，video:视频配置',
      },
      group: {
        type: DataTypes.STRING(10),
        defaultValue: '',
        comment: '分组',
      },
    }, {
      sequelize,
      modelName: 'ChannelSetting',
      comment: '栏目配置',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelSetting
   */
  static reateAssociation(sequelize) {
    // 栏目 - 栏目配置， 一对多
    ChannelSetting.belongsTo(sequelize.models['Channel']);
  }
}

module.exports = ChannelSetting;
