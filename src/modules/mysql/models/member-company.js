/* eslint-disable new-cap */
/*
 * @description: 单位会员
 * @author: zpl
 * @Date: 2020-08-17 18:35:54
 * @LastEditTime: 2021-01-27 18:00:45
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
const { memberStatus } = require('../../../dictionary');

/**
   * 单位会员
   *
   * @class MemberCompany
   * @extends {Model}
   */
class MemberCompany extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberCompany
   */
  static initNow(sequelize) {
    MemberCompany.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      corporateName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '公司名称',
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '座机',
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '邮箱',
      },
      contacts: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '联系人',
      },
      contactsMobile: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: '联系人手机',
      },
      industry: {
        type: DataTypes.STRING,
        comment: '所属行业',
      },
      legalPerson: {
        type: DataTypes.STRING,
        comment: '法人',
      },
      website: {
        type: DataTypes.STRING,
        comment: '单位网站',
      },
      address: {
        type: DataTypes.STRING,
        comment: '地址',
      },
      zipCode: {
        type: DataTypes.STRING(6),
        comment: '邮编',
      },
      intro: {
        type: DataTypes.TEXT,
        comment: '公司简介',
      },
      logonDate: {
        type: DataTypes.STRING,
        comment: '注册日期',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: memberStatus.applying,
        comment: '状态',
      },
      rejectDesc: {
        type: DataTypes.STRING,
        comment: '驳回原因',
      },
      sendEmailStatus: {
        type: DataTypes.STRING,
        defaultValue: '未发送',
        comment: '邮件发送状态，未发送|发送失败|发送成功时间',
      },
    }, {
      sequelize,
      modelName: 'MemberCompany',
      comment: '单位会员',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberCompany
   */
  static reateAssociation(sequelize) {
    // 会员 - 会员类型， 多对一
    MemberCompany.belongsTo(sequelize.models['MemberType']);
  }
}

module.exports = MemberCompany;
