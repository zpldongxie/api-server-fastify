/* eslint-disable new-cap */
/*
 * @description: 入驻名录
 * @author: zpl
 * @Date: 2020-08-17 18:35:54
 * @LastEditTime: 2021-02-20 16:26:43
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
const { entryStatus } = require('../../../dictionary');

/**
   * 入驻名录
   *
   * @class Entry
   * @extends {Model}
   */
class Entry extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Entry
   */
  static initNow(sequelize) {
    Entry.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      corporateName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '单位名称',
      },
      tel: {
        type: DataTypes.STRING(15),
        allowNull: false,
        comment: '座机',
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '邮箱',
      },
      address: {
        type: DataTypes.STRING,
        comment: '地址',
      },
      zipCode: {
        type: DataTypes.STRING(6),
        comment: '邮编',
      },
      website: {
        type: DataTypes.STRING,
        comment: '单位网站',
      },
      contacts: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '联系人',
      },
      contactsMobile: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: '联系人手机',
      },
      type: {
        type: DataTypes.ENUM,
        values: ['厂商', '产品'],
        allowNull: false,
        comment: '申请类别',
      },
      descStr: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '申请描述',
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          entryStatus.applying,
          entryStatus.firstPass,
          entryStatus.alreadyEntry,
          entryStatus.reject,
          entryStatus.disable,
        ],
        defaultValue: entryStatus.applying,
        comment: '状态',
      },
      rejectDesc: {
        type: DataTypes.STRING(64),
        comment: '驳回原因',
      },
      logonDate: {
        type: DataTypes.DATE,
        comment: '注册日期',
      },
      sendEmailStatus: {
        type: DataTypes.STRING(25),
        defaultValue: '未发送',
        comment: '邮件发送状态，未发送|发送失败|发送成功时间',
      },
    }, {
      sequelize,
      modelName: 'Entry',
      comment: '入驻名录',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Entry
   */
  static reateAssociation(sequelize) {
    // 入驻名录 - 栏目， 多对多
    Entry.belongsToMany(sequelize.models['Channel'], { through: 'ChannelEntry' });
  }
}

module.exports = Entry;
