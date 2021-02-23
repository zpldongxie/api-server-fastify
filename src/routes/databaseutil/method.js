/* eslint-disable camelcase */
/*
 * @description:
 * @author: zpl
 * @Date: 2021-01-31 20:22:20
 * @LastEditTime: 2021-02-22 14:54:36
 * @LastEditors: zpl
 */
const got = require('got');
const { Op } = require('sequelize');

const CommonMethod = require('../commonMethod');
const { onRouterSuccess, onRouterError } = require('../../util');

/**
 * 路由用到的方法
 *
 * @class Method
 */
class Method {
  /**
   * Creates an instance of Method.
   * @param {*} mysqlModel
   * @param {*} ajv
   * @memberof Method
   */
  constructor(mysqlModel, ajv) {
    // 旧数据请求实体封装
    this.gotInstance = got.extend({
      responseType: 'json',
    });
    // 新旧栏目ID映射
    this.channelIdComp = {};

    const SysConfigModule = mysqlModel.SysConfig;
    const ChannelModule = mysqlModel.Channel;
    const ChannelTypeModule = mysqlModel.ChannelType;
    const ChannelSettingModule = mysqlModel.ChannelSetting;
    const ArticleModule = mysqlModel.Article;
    const MemberCompanyModule = mysqlModel.MemberCompany;
    this.sysConfigDBMethod = new CommonMethod(SysConfigModule, ajv).dbMethod;
    this.channelDBMethod = new CommonMethod(ChannelModule, ajv).dbMethod;
    this.channelTypeDBMethod = new CommonMethod(ChannelTypeModule, ajv).dbMethod;
    this.ChannelSettingModule = ChannelSettingModule;
    this.channelSettingDBMethod = new CommonMethod(ChannelSettingModule, ajv).dbMethod;
    this.articleDBMethod = new CommonMethod(ArticleModule, ajv).dbMethod;
    this.memberCompanyDBMethod = new CommonMethod(MemberCompanyModule, ajv).dbMethod;
  }

  /**
   * 初始化新旧栏目ID映射
   *
   * @memberof Method
   */
  async initChannelIdComp() {
    if (!Object.keys(this.channelIdComp).length) {
      const { status, data } = await this.getOldChannels();
      const oldChannelList = status ? data : [];
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
      const settingRes = await this.sysConfigDBMethod.findOne({ where: { name: 'oldManager' } });
      if (settingRes.status) {
        const prefixUrl = settingRes.data.value;
        const { body } = await this.gotInstance('api/channels', { prefixUrl });
        return {
          status: 1,
          data: body.data,
        };
      } else {
        return {
          status: 0,
          message: '获取同步数据源配置失败',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        message: '获取数据失败',
      };
    }
  };

  /**
   * 从旧数据库同步栏目数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async syncChannel(request, reply) {
    console.log('databaseutil syncChannel begin');
    const oldData = await this.getOldChannels();
    if (oldData.status) {
      const oldChannelList = oldData.data;
      await this.articleDBMethod.destroy();
      await this.channelSettingDBMethod.deleteMany({ ChannelId: { [Op.not]: null } });
      await this.channelDBMethod.destroy();
      console.log('---文章表、栏目表、栏目配置表已清空，开始同步---');
      // 先不考虑关联
      let newTotal = 0;
      for (let i = 0; i < oldChannelList.length; i++) {
        const oldChannel = oldChannelList[i];
        // eslint-disable-next-line no-unused-vars
        const { id, parentId, ChannelTypeId, ChannelType, ...data } = oldChannel;
        const currentData = {
          ...data,
        };
        const currentRes = await this.channelDBMethod.create(currentData, { include: [this.ChannelSettingModule] });
        if (currentRes.status) {
          newTotal += currentRes.status;
          const ct = await this.channelTypeDBMethod.findOne({ where: { name: ChannelType.name } });
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
    } else {
      console.log('---' + oldData.message + '---');
      onRouterError(reply, oldData.message);
    }
  };

  /**
   * 获取旧数据库公共栏目配置数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldCommonSettings() {
    try {
      const settingRes = await this.sysConfigDBMethod.findOne({ where: { name: 'oldManager' } });
      if (settingRes.status) {
        const prefixUrl = settingRes.data.value;
        const { body } = await this.gotInstance('rest/getCommonSettings', { prefixUrl });
        return {
          status: 1,
          data: body.data,
        };
      } else {
        return {
          status: 0,
          message: '获取同步数据源配置失败',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        message: '获取数据失败',
      };
    }
  }

  /**
   * 从旧数据库同步公共栏目配置数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async syncCommonSettings(request, reply) {
    console.log('databaseutil syncCommonSettings begin');
    const oldData = await this.getOldCommonSettings();
    if (oldData.status) {
      await this.channelSettingDBMethod.deleteMany({ ChannelId: null });
      console.log('---公共配置已清空，开始同步---');
      const commonSettings = oldData.data;
      let newTotal = 0;
      for (let i = 0; i < commonSettings.length; i++) {
        const commonSetting = commonSettings[i];
        const currentRes = await this.channelSettingDBMethod.create(commonSetting);
        newTotal += currentRes.status;
      }
      console.log(`---已创建${newTotal}条记录---`);
      console.log('---公共配置同步完成---');
      onRouterSuccess(reply, {
        oldTotal: commonSettings.length,
        newTotal,
      });
    } else {
      console.log('---' + oldData.message + '---');
      onRouterError(reply, oldData.message);
    }
  }

  /**
   * 获取旧数据库文章数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldArticles() {
    try {
      const settingRes = await this.sysConfigDBMethod.findOne({ where: { name: 'oldManager' } });
      if (settingRes.status) {
        const prefixUrl = settingRes.data.value;
        const { body } = await this.gotInstance('api/articles', { prefixUrl });
        if (body.status === 'ok') {
          const list = body.data;
          for (let i = 0; i < list.length; i++) {
            const current = list[i];
            const res = await this.gotInstance(`api/article/${current.id}`, { prefixUrl });
            current.mainCon = res.body.data.mainCon;
          }
          return {
            status: 1,
            data: list,
          };
        } else {
          return {
            status: 0,
            message: '获取数据失败',
          };
        }
      } else {
        return {
          status: 0,
          message: '获取同步数据源配置失败',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        message: '获取数据失败',
      };
    }
  }

  /**
   * 从旧数据库同步文章数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async syncArticle(request, reply) {
    console.log('databaseutil syncArticle begin');
    const oldData = await this.getOldArticles();
    if (oldData.status) {
      await this.initChannelIdComp();
      await this.articleDBMethod.destroy();
      console.log('---文章表及文章扩展表已清空，开始同步---');
      const oldArticles = oldData.data;
      console.log('---待同步文章数---', oldArticles.length);
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
        // console.log('---------------------');
        // console.log(currentRes);
        // console.log('---------------------');
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
    } else {
      console.log('---' + oldData.message + '---');
      onRouterError(reply, oldData.message);
    }
  }

  /**
   * 获取旧数据库单位会员数据
   *
   * @return {*}
   * @memberof Method
   */
  async getOldMemberCompany() {
    try {
      const settingRes = await this.sysConfigDBMethod.findOne({ where: { name: 'oldManager' } });
      if (settingRes.status) {
        const prefixUrl = settingRes.data.value;
        const { body: { status, data } } = await this.gotInstance('api/membercompanys', { prefixUrl });
        if (status === 'ok') {
          return {
            status: 1,
            data,
          };
        } else {
          return {
            status: 0,
            message: '获取数据失败',
          };
        }
      } else {
        return {
          status: 0,
          message: '获取同步数据源配置失败',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        message: '获取数据失败',
      };
    }
  }

  /**
   * 从旧数据库同步单位会员数据
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async syncMemberCompany(request, reply) {
    console.log('databaseutil yncMemberCompany begin');
    const oldData = await this.getOldMemberCompany();
    if (oldData.status) {
      await this.memberCompanyDBMethod.destroy();
      console.log('---单位会员表已清空，开始同步---');
      const oldMembers = oldData.data;
      let newTotal = 0;
      for (let i = 0; i < oldMembers.length; i++) {
        const oldMember = oldMembers[i];
        const currentRes = await this.memberCompanyDBMethod.create(oldMember);
        newTotal += currentRes.status;
      }
      console.log(`---已创建${newTotal}条记录---`);
      console.log('---单位会员表同步完成---');
      onRouterSuccess(reply, {
        oldTotal: oldMembers.length,
        newTotal,
      });
    } else {
      console.log('---' + oldData.message + '---');
      onRouterError(reply, oldData.message);
    }
  }
}

module.exports = Method;
