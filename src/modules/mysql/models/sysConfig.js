/*
 * @description: 系统配置表
 * @author: zpl
 * @Date: 2020-10-14 21:31:40
 * @LastEditTime: 2021-02-25 08:45:37
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
/**
 * 系统配置
 *
 * @class SysConfig
 * @extends {Model}
 */
class SysConfig extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof SysConfig
   */
  static initNow(sequelize) {
    SysConfig.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        comment: '配置名称',
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '配置值',
      },
      descStr: {
        type: DataTypes.STRING,
        comment: '配置说明',
      },
      group: {
        type: DataTypes.STRING(10),
        defaultValue: '默认',
        comment: '分组',
      },
    }, {
      sequelize,
      modelName: 'SysConfig',
      comment: '系统配置',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof SysConfig
   */
  static reateAssociation(sequelize) {}
}


module.exports = SysConfig;
