/* eslint-disable new-cap */
/*
 * @description: 个人会员
 * @author: zpl
 * @Date: 2020-08-17 18:35:54
 * @LastEditTime: 2021-01-12 09:19:36
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
const { memberStatus } = require('../../../dictionary');

/**
   * 个人会员
   *
   * @class MemberIndivic
   * @extends {Model}
   */
class MemberIndivic extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberIndivic
   */
  static initNow(sequelize) {
    MemberIndivic.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '姓名',
      },
      idType: {
        type: DataTypes.STRING,
        comment: '证件类型',
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '证件号码',
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '手机',
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '邮箱',
      },
      enName: {
        type: DataTypes.STRING(64),
        comment: '英文名',
      },
      sex: {
        type: DataTypes.STRING(2),
        comment: '性别',
        values: ['男', '女'],
      },
      maritalStatus: {
        type: DataTypes.STRING,
        comment: '婚姻状况',
      },
      website: {
        type: DataTypes.STRING,
        comment: '个人网站',
      },
      homeAddress: {
        type: DataTypes.STRING,
        comment: '家庭住址',
      },
      zipCode: {
        type: DataTypes.STRING(6),
        comment: '邮编',
      },
      profession: {
        type: DataTypes.STRING,
        comment: '职业',
      },
      birthday: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '生日',
      },
      intro: {
        type: DataTypes.TEXT,
        comment: '个人介绍',
      },
      logonDate: {
        type: DataTypes.STRING,
        field: 'logon_data',
        comment: '注册日期',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: memberStatus.underReview,
        comment: '状态',
      },
      rejectDesc: {
        type: DataTypes.STRING,
        comment: '驳回原因',
      },
    }, {
      sequelize,
      modelName: 'MemberIndivic',
      comment: '个人会员',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberIndivic
   */
  static reateAssociation(sequelize) {
    // 会员 - 会员类型， 多对一
    MemberIndivic.belongsTo(sequelize.models['MemberType']);
  }
}

module.exports = MemberIndivic;
