/*
 * @description: 文章内容
 * @author: zpl
 * @Date: 2020-07-28 10:16:12
 * @LastEditTime: 2020-09-11 18:41:58
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
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标题',
      },
      subtitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '副标题',
      },
      keyWord: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'key_word',
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
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        defaultValue: '',
        comment: '作者',
      },
      source: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        defaultValue: '',
        comment: '来源',
      },
      conDate: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'con_date',
        comment: '时间',
      },
      isHead: {
        // eslint-disable-next-line new-cap
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        field: 'is_head',
        comment: '是否头条',
      },
      isRecom: {
        // eslint-disable-next-line new-cap
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        field: 'is_recom',
        comment: '是否推荐',
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'order_index',
        comment: '排序值',
      },
      canComment: {
        // eslint-disable-next-line new-cap
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        field: 'can_comment',
        comment: '允许评论',
      },
      commentStartTime: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'comment_start_time',
        comment: '评论开始时间',
      },
      commentEndTime: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'comment_end_time',
        comment: '评论结束时间',
      },
      contentType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'content_type',
        comment: '内容类型',
      },
      mainCon: {
        type: DataTypes.TEXT,
        defaultValue: '',
        field: 'main_con',
        comment: '文章内容',
      },
      mainPic: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'main_pic',
        comment: '图片文章内容',
      },
      mainVideo: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'main_video',
        comment: '视频文章内容',
      },
      mainUrl: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'main_url',
        comment: '链接文章内容',
      },
      approvalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'approval_status',
        comment: '审核状态',
      },
      pubStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pub_status',
        comment: '发布状态',
      },
    }, {
      sequelize,
      modelName: 'Article',
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
    Article.belongsToMany(sequelize.models['Channel'], { through: 'article_channel' });
  }
}

module.exports = Article;
