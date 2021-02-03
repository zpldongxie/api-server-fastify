/* eslint-disable new-cap */
/*
 * @description: 栏目
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-03 11:09:05
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 栏目
   *
   * @class Channel
   * @extends {Model}
   */
class Channel extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Channel
   */
  static initNow(sequelize) {
    Channel.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '栏目标题',
      },
      enName: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        comment: '英文名',
      },
      parentId: {
        type: DataTypes.UUID,
        comment: '父栏目ID',
        references: {
          model: Channel,
          key: 'id',
        },
      },
      keyWord: {
        type: DataTypes.STRING(20),
        defaultValue: '',
        comment: '关键字',
      },
      descStr: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '描述',
      },
      showStatus: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        comment: '显示状态，可根据业务自行设置不同显示状态',
      },
      url: {
        type: DataTypes.STRING,
        comment: '链接',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        comment: '排序值',
      },
      settingExtend: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: '是否继承设置',
      },
    }, {
      sequelize,
      modelName: 'Channel',
      comment: '栏目',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Channel
   */
  static reateAssociation(sequelize) {
    // 栏目 - 栏目类型， 多对一
    Channel.belongsTo(sequelize.models['ChannelType']);
    // 栏目 - 文章， 多对多
    Channel.belongsToMany(sequelize.models['Article'], { through: 'ChannelAtricle' });

    // 栏目 - 栏目配置， 一对多
    Channel.hasMany(sequelize.models['ChannelSetting'], { onDelete: 'CASCADE' });
    // 栏目 - 培训， 一对多
    Channel.hasMany(sequelize.models['Training'], { onDelete: 'CASCADE' });
  }
}

module.exports = Channel;
