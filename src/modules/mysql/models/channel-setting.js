/*
 * @description: 栏目配置
 * @author: zpl
 * @Date: 2020-07-28 10:42:50
 * @LastEditTime: 2020-08-18 20:55:41
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
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '标题',
      },
      descStr: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'desc_str',
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
        comment: '链接',
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '配置类型，如，pic:图片配置，url:链接配置，desc:文字配置，data:视频配置',
      },
      createTime: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'create_time',
        comment: '',
      },
    }, {
      sequelize,
      modelName: 'ChannelSetting',
      tableName: 'channel_setting',
      // TODO: 等完全从java后台切换过来后，这个属性要移除
      timestamps: false,
      indexes: [{ unique: true, fields: ['id'] }],
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
    ChannelSetting.belongsTo(sequelize.models['Channel'], { foreignKey: { name: 'channel_id' } });
  }
}

module.exports = ChannelSetting;
