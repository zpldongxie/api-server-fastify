/* eslint-disable new-cap */
/*
 * @description: 会员类型
 * @author: zpl
 * @Date: 2020-08-17 18:57:56
 * @LastEditTime: 2020-10-14 23:18:56
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 会员类型
   *
   * @class MemberType
   * @extends {Model}
   */
class MemberType extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberType
   */
  static initNow(sequelize) {
    MemberType.init({
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '类型名称',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
    }, {
      sequelize,
      modelName: 'MemberType',
      timestamps: false,
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof MemberType
   */
  static reateAssociation(sequelize) {
    // 一对多关系表，必须先同步，否则会报 'Cannot add foreign key constraint'
    MemberType.sync();
    // 会员类型 - 企业会员， 一对多
    MemberType.hasMany(sequelize.models['MemberCompany']);
    // 会员类型 - 个人会员， 一对多
    MemberType.hasMany(sequelize.models['MemberIndivic']);
  }
}

module.exports = MemberType;
