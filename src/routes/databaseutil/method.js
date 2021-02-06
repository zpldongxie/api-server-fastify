/* eslint-disable camelcase */
/*
 * @description:
 * @author: zpl
 * @Date: 2021-01-31 20:22:20
 * @LastEditTime: 2021-02-06 09:52:31
 * @LastEditors: zpl
 */
const got = require('got');
const { Op } = require('sequelize');

const { onRouterSuccess } = require('../../util');

/**
 * 路由用到的方法
 *
 * @class Method
 */
class Method {
  /**
   * Creates an instance of Method.
   * @param {*} oldManager
   * @memberof Method
   */
  constructor(oldManager, {
    channelDBMethod,
    channelTypeDBMethod,
    channelSettingDBMethod,
    articleDBMethod,
  }) {
    // 旧数据请求实体封装
    this.gotInstance = got.extend({
      prefixUrl: oldManager,
      responseType: 'json',
    });
    // 新旧栏目ID映射
    this.channelIdComp = {};

    this.channelDBMethod = channelDBMethod;
    this.channelTypeDBMethod = channelTypeDBMethod;
    this.channelSettingDBMethod = channelSettingDBMethod;
    this.articleDBMethod = articleDBMethod;
  }

  /**
   * 初始化新旧栏目ID映射
   *
   * @memberof Method
   */
  async initChannelIdComp() {
    if (!Object.keys(this.channelIdComp).length) {
      const oldChannelList = await this.getOldChannels();
      for (let i = 0; i < oldChannelList.length; i++) {
        const oldChannel = oldChannelList[i];
        const currentRes = await this.channelDBMethod.findOne({ where: { enName: oldChannel.enName } });
        if (currentRes.status) {
          this.channelIdComp[oldChannel.id] = currentRes.data.id;
        }
      }
    }
  }

  /**
   * 获取旧数据库栏目数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldChannels() {
    try {
      const res = await this.gotInstance('api/channels');
      return res.body.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  /**
   * 从旧数据库同步栏目数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async asyncChannel(request, reply) {
    console.log('databaseutil asyncChannel begin');
    const oldChannelList = await this.getOldChannels();
    await this.channelDBMethod.destroy();
    console.log('---栏目表已清空，开始同步---');
    // 先不考虑关联
    let newTotal = 0;
    for (let i = 0; i < oldChannelList.length; i++) {
      const oldChannel = oldChannelList[i];
      // eslint-disable-next-line no-unused-vars
      const { id, parentId, createTime, channelType, ChannelSettings, isShow, ...data } = oldChannel;
      const currentData = {
        ...data,
        showStatus: isShow,
        createdAt: createTime,
      };
      const currentRes = await this.channelDBMethod.create(currentData);
      newTotal += currentRes.status;
      if (currentRes.status) {
        const ct = await this.channelTypeDBMethod.findOne({ where: { name: channelType } });
        currentRes.data.setChannelType(ct.data);
        this.channelIdComp[id] = currentRes.data.id;
      }
    }
    console.log(`---已创建${newTotal}条记录---`);
    // 同步parentId关联信息
    const oldRelationChannelList = oldChannelList.filter((channel) => channel.parentId !== null);
    for (let i = 0; i < oldRelationChannelList.length; i++) {
      const oldChannel = oldRelationChannelList[i];
      await this.channelDBMethod.updateOne(this.channelIdComp[oldChannel.id], {
        parentId: this.channelIdComp[oldChannel.parentId],
      });
    }
    console.log('---完成外键信息同步---');

    console.log('---栏目表同步完成---');
    onRouterSuccess(reply, {
      oldTotal: oldChannelList.length,
      newTotal,
    });
  };

  /**
   * 获取旧数据库栏目配置数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldChannelSettings() {
    try {
      const res = await this.gotInstance('api/channelsettings');
      return res.body.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * 从旧数据库同步栏目配置数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async asyncChannelSettings(request, reply) {
    console.log('databaseutil asyncChannelSettings begin');
    await this.initChannelIdComp();
    await this.channelSettingDBMethod.destroy();
    console.log('---栏目配置表已清空，开始同步---');
    const oldChannelSettings = await this.getOldChannelSettings();
    let newTotal = 0;
    for (let i = 0; i < oldChannelSettings.length; i++) {
      const oldSetting = oldChannelSettings[i];
      // eslint-disable-next-line no-unused-vars
      const { id, channel_id, ...data } = oldSetting;
      const currentData = {
        ...data,
        ChannelId: this.channelIdComp[channel_id],
      };
      const currentRes = await this.channelSettingDBMethod.create(currentData);
      newTotal += currentRes.status;
    }

    console.log('---栏目配置表同步完成---');
    onRouterSuccess(reply, {
      oldTotal: oldChannelSettings.length,
      newTotal,
    });
  }

  /**
   * 获取旧数据库栏目配置数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldArticles() {
    try {
      const res = await this.gotInstance('api/articles');
      if (res.body.status === 'ok') {
        const list = res.body.data;
        for (let i = 0; i < list.length; i++) {
          const current = list[i];
          const res = await this.gotInstance(`api/article/${current.id}`);
          current.mainCon = res.body.data.mainCon;
        }
        return list;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * 从旧数据库同步文章数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async asyncArticle(request, reply) {
    console.log('databaseutil asyncArticle begin');
    await this.initChannelIdComp();
    await this.articleDBMethod.destroy();
    console.log('---文章表及文章扩展表已清空，开始同步---');
    const oldArticles = await this.getOldArticles();
    let newTotal = 0;
    for (let i = 0; i < oldArticles.length; i++) {
      const oldArticle = oldArticles[i];
      const {
        // eslint-disable-next-line no-unused-vars
        id, commentStartTime, commentEndTime,
        conDate,
        Channels,
        ArticleExtensions,
        ...data
      } = oldArticle;
      const currentData = {
        conDate,
        ...data,
        createdAt: new Date(conDate),
      };
      const currentRes = await this.articleDBMethod.create(currentData);
      const current = currentRes.data;

      // 设置栏目关联
      const newChannelIds = Channels.map((c) => this.channelIdComp[c.id]);
      if (newChannelIds.length) {
        const newChannels = await this.channelDBMethod.findAll({ where: { id: { [Op.in]: newChannelIds } } });
        current.addChannels(newChannels.data);
      }
      // 创建并关联扩展信息
      for (let i = 0; i < ArticleExtensions.length; i++) {
        const extension = ArticleExtensions[i];
        // eslint-disable-next-line no-unused-vars
        const { id, ...extensionData } = extension;
        current.createArticleExtension(extensionData);
      }
      newTotal += currentRes.status;
    }

    console.log('---文章表同步完成---');
    onRouterSuccess(reply, {
      oldTotal: oldArticles.length,
      newTotal,
    });
  }
}

module.exports = Method;
