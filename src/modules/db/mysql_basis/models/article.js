/*
 * @description: 文章内容
 * @author: zpl
 * @Date: 2020-07-28 10:16:12
 * @LastEditTime: 2021-02-24 14:51:36
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 文章
 *
 * @class Article
 * @extends {Model}
 */
class Article extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Article
   */
  static initNow(sequelize) {
    Article.init({
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
      subtitle: {
        type: DataTypes.STRING(64),
        defaultValue: '',
        comment: '副标题',
      },
      keyWord: {
        type: DataTypes.STRING(20),
        defaultValue: '',
        comment: '关键词',
      },
      summary: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '摘要',
      },
      thumbnail: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '标题图片',
      },
      auth: {
        type: DataTypes.STRING(64),
        defaultValue: '',
        comment: '作者',
      },
      source: {
        type: DataTypes.STRING(100),
        defaultValue: '本站原创',
        comment: '来源',
      },
      conDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '发布时间',
      },
      isHead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否头条',
      },
      isRecom: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否推荐',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        comment: '排序值',
      },
      contentType: {
        type: DataTypes.ENUM,
        values: ['文章', '链接'],
        defaultValue: '文章',
        comment: '内容类型',
      },
      mainCon: {
        type: DataTypes.TEXT,
        defaultValue: '',
        comment: '文章内容',
      },
      mainUrl: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '链接文章内容',
      },
      approvalStatus: {
        type: DataTypes.ENUM('无需审核', '待审核', '通过', '驳回'),
        defaultValue: '无需审核',
        comment: '审核状态',
      },
      pubStatus: {
        type: DataTypes.ENUM('草稿', '已发布', '已删除'),
        defaultValue: '草稿',
        comment: '发布状态',
      },
    }, {
      sequelize,
      modelName: 'Article',
      comment: '文章内容',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Article
   */
  static reateAssociation(sequelize) {
    // 栏目 - 文章， 多对多
    Article.belongsToMany(sequelize.models['Channel'], { through: 'ChannelAtricle' });
  }
}

module.exports = Article;
