/* eslint-disable new-cap */
/*
 * @description: 栏目类型
 * @author: zpl
 * @Date: 2021-02-01 11:52:44
 * @LastEditTime: 2021-02-03 11:08:12
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 栏目类型
   *
   * @class ChannelType
   * @extends {Model}
   */
class ChannelType extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelType
   */
  static initNow(sequelize) {
    ChannelType.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '名称',
      },
      descStr: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '描述',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        comment: '排序值',
      },
    }, {
      sequelize,
      modelName: 'ChannelType',
      comment: '栏目类型',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ChannelType
   */
  static reateAssociation(sequelize) {
    // 栏目类型 - 栏目， 一对多
    ChannelType.hasMany(sequelize.models['Channel']);
  }
}

module.exports = ChannelType;
