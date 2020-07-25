/*
 * @description: 栏目
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-07-25 22:26:32
 * @LastEditors: zpl
 */
const sequelize = require('../connect');
const {Model, DataTypes} = require('sequelize');

/**
   * 栏目
   *
   * @class Channel
   * @extends {Model}
   */
class Channel extends Model {}

Channel.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '栏目标题',
  },
  enName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'en_name',
    comment: '英文名',
  },
  channelType: {
    type: DataTypes.STRING,
    comment: '栏目类型',
    allowNull: false,
    field: 'channel_type',
  },
  parentId: {
    type: DataTypes.BIGINT,
    field: 'parent_id',
    comment: '父栏目ID',
    references: {
      model: Channel,
      key: 'id',
    },
  },
  keyWord: {
    type: DataTypes.STRING,
    field: 'key_word',
    comment: '关键字',
  },
  descStr: {
    type: DataTypes.STRING,
    field: 'desc_str',
    comment: '描述',
  },
  isShow: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: 'is_show',
    comment: '是否显示',
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '链接',
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'order_index',
    comment: '排序值',
  },
  settingExtend: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    field: 'setting_extend',
    comment: '是否继承设置',
  },
}, {
  sequelize,
  modelName: 'Channel',
  tableName: 'channel',
  createdAt: 'create_time',
  indexes: [{unique: true, fields: ['id']}],
});

Channel.sync({match: new RegExp('^' + sequelize.getDatabaseName() + '$')});

module.exports = Channel;
