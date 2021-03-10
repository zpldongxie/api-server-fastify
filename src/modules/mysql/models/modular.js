/*
 * @description: 功能模块
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-03-09 12:30:35
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 功能模块
 *
 * @class Modular
 * @extends {Model}
 */
class Modular extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Modular
   */
  static initNow(sequelize) {
    Modular.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '功能名称',
      },
      tag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '功能标记',
      },
      parentId: {
        type: DataTypes.UUID,
        references: {
          model: Modular,
          key: 'id',
        },
        comment: '父ID',
      },
      descStr: {
        type: DataTypes.STRING(64),
        comment: '功能描述',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        comment: '排序值',
      },
    }, {
      sequelize,
      modelName: 'Modular',
      timestamps: false,
      comment: '功能模块',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Modular
   */
  static reateAssociation(sequelize) {
    // 功能模块 - 权限， 一对多
    Modular.hasMany(sequelize.models['Jurisdiction']);
  }
}

module.exports = Modular;
