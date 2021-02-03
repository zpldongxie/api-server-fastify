/* eslint-disable new-cap */
/*
 * @description: 会员类型
 * @author: zpl
 * @Date: 2020-08-17 18:57:56
 * @LastEditTime: 2021-02-03 11:09:37
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
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '类型名称',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '描述',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        comment: '排序值',
      },
    }, {
      sequelize,
      modelName: 'MemberType',
      timestamps: false,
      comment: '会员类型',
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
    // 会员类型 - 单位会员， 一对多
    MemberType.hasMany(sequelize.models['MemberCompany']);
    // 会员类型 - 个人会员， 一对多
    MemberType.hasMany(sequelize.models['MemberIndivic']);
  }
}

module.exports = MemberType;
