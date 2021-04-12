/*
 * @description: 用户扩展
 * @author: zpl
 * @Date: 2021-02-24 14:25:12
 * @LastEditTime: 2021-02-24 14:31:38
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 用户扩展
 *
 * @class UserExtension
 * @extends {Model}
 */
class UserExtension extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof UserExtension
   */
  static initNow(sequelize) {
    UserExtension.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '标题',
      },
      info: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '内容',
      },
      remark: {
        type: DataTypes.STRING(100),
        comment: '备注',
      },
    }, {
      sequelize,
      modelName: 'UserExtension',
      comment: '用户扩展',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof UserExtension
   */
  static reateAssociation(sequelize) {
    // 用户扩展 - 用户， 多对一
    UserExtension.belongsTo(sequelize.models['User']);
  }
}

module.exports = UserExtension;
