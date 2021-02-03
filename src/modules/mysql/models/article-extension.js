/* eslint-disable new-cap */
/*
 * @description: 文章扩展信息
 * @author: zpl
 * @Date: 2020-07-28 10:16:12
 * @LastEditTime: 2021-01-30 14:08:10
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 文章扩展信息
 *
 * @class ArticleExtension
 * @extends {Model}
 */
class ArticleExtension extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof ArticleExtension
   */
  static initNow(sequelize) {
    ArticleExtension.init({
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
        defaultValue: '',
        comment: '备注',
      },
    }, {
      sequelize,
      modelName: 'ArticleExtension',
      comment: '文章扩展信息',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof ArticleExtension
   */
  static reateAssociation(sequelize) {
    // 扩展 - 文章， 多对一
    ArticleExtension.belongsTo(sequelize.models['Article']);
  }
}

module.exports = ArticleExtension;
