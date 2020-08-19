/*
 * @description: 栏目
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-08-18 20:56:27
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
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
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
        type: DataTypes.INTEGER,
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
        // eslint-disable-next-line new-cap
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
        field: 'is_show',
        comment: '是否显示',
      },
      url: {
        type: DataTypes.STRING,
        comment: '链接',
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      // FIXME: 等完全从java后台切换过来后，这个属性要移除
      createTime: {
        type: DataTypes.STRING,
        field: 'create_time',
        comment: '创建时间',
      },
    }, {
      sequelize,
      modelName: 'Channel',
      tableName: 'channel',
      // FIXME: 等完全从java后台切换过来后，这个属性要移除
      timestamps: false,
      indexes: [{ unique: true, fields: ['id'] }],
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
    // 栏目 - 文章， 多对多
    Channel.belongsToMany(sequelize.models['ContentDetail'], {
      through: 'content_detail_channel',
      foreignKey: 'channel_id',
    });

    // 栏目 - 栏目配置， 一对多
    Channel.hasMany(sequelize.models['ChannelSetting']);
    // 栏目 - 培训， 一对多
    Channel.hasMany(sequelize.models['Training']);
  }
}

module.exports = Channel;

// module.exports = (sequelize) => {


//   return Channel;
// };
