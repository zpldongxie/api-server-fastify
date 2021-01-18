/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2021-01-18 16:42:30
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
// const { Op } = require('sequelize');
const ChannelMethod = require('../channel/method');
const ChannelSettingMethod = require('../channelsetting/method');
const ArticleMethod = require('../article/method');
const TrainingRegMethod = require('../trainingreg/method');
const MemberCompanyMethod = require('../membercompany/method');
const MemberIndivicMethod = require('../memberindivic/method');
const ServiceRequestMethod = require('../servicerequest/method');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { ajv } = opts;
  const channelMethod = new ChannelMethod(mysqlModel.Channel, ajv);
  const channelSettingMethod = new ChannelSettingMethod(mysqlModel.ChannelSetting, ajv);
  const articleMethod = new ArticleMethod(mysqlModel.Article, ajv);
  const trainingRegMethod = new TrainingRegMethod(mysqlModel.TrainingReg, ajv);
  const memberCompanyMethod = new MemberCompanyMethod(mysqlModel.MemberCompany, ajv);
  const memberIndivicMethod = new MemberIndivicMethod(mysqlModel.MemberIndivic, ajv);
  const serviceRequestMethod = new ServiceRequestMethod(mysqlModel.ServiceRequest, ajv);


  const querySchema = require('./query-content-list-schema');
  const getByIdSchema = require('./query-content-by-id-schema');
  const trainingregSchema = require('./trainingreg-schema');
  const memberCompanyRegSchema = require('./member-company-reg-schema');
  const memberIndivicRegSchema = require('./member-indivic-reg-schema');
  const putServiceRequestSchema = require('./put-service-request-schema');

  /**
   * 获取首页数据
   *
   * @param {*} request
   * @param {*} reply
   */
  const getHomePageData = async (request, reply) => {
    const that = articleMethod;
    const getBanner = (settings) => {
      const list = settings
          .filter((setting) => setting.title.includes('banner'))
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((setting) => ({
            url: setting.link,
            src: setting.pic,
          }));
      return list;
    };

    await (that.run(request, reply))(
        async () => {
          const { config: { ChannelModel, ArticleExtensionModel } } = reply.context;
          // 配置
          const settings = [];

          // 轮播图
          const bannerList = getBanner(settings);

          // 头条轮播

          let headList = [];
          const headListRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
              'isHead': true,
            },
            sorter: {
              'orderIndex': 'desc',
              'conDate': 'desc',
            },
            current: 1,
            pageSize: 6,
            attributes: {
              exclude: ['mainCon'],
            },
            include: [
              {
                model: ChannelModel,
                attributes: ['id', 'name', 'enName'],
              },
              {
                model: ArticleExtensionModel,
                attributes: ['title', 'info', 'remark'],
              },
            ],
          },
          true);
          if (headListRes.status) {
            headList = headListRes.data.list;
          }

          // 协会动态
          let associationNewsList = [];
          const acnRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
            },
            order: [
              ['isRecom', 'DESC'],
              ['orderIndex', 'DESC'],
              ['conDate', 'DESC'],
            ],
            include: [{
              model: mysqlModel.Channel,
              where: { enName: 'xkdt' },
            }],
            pageSize: 5,
          });
          if (acnRes.status) {
            associationNewsList = acnRes.data.list;
          }

          // tab页
          const newsTabList = [];
          // 省内动态
          const sndt = {
            nav: { 'id': 17, 'name': '省内动态', 'enName': 'sndt' },
            list: [],
          };
          const sndtRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
            },
            order: [
              ['isRecom', 'DESC'],
              ['orderIndex', 'DESC'],
              ['conDate', 'DESC'],
            ],
            include: [{
              model: mysqlModel.Channel,
              where: { enName: 'sndt' },
            }],
            pageSize: 6,
          });
          if (sndtRes.status) {
            sndt.list = sndtRes.data.list;
          }
          newsTabList.push(sndt);
          // 国内动态
          const gndt = {
            nav: { 'id': 18, 'name': '国内动态', 'enName': 'gndt' },
            list: [],
          };
          const gndtRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
            },
            order: [
              ['isRecom', 'DESC'],
              ['orderIndex', 'DESC'],
              ['conDate', 'DESC'],
            ],
            include: [{
              model: mysqlModel.Channel,
              where: { enName: 'gndt' },
            }],
            pageSize: 6,
          });
          if (gndtRes.status) {
            gndt.list = gndtRes.data.list;
          }
          newsTabList.push(gndt);
          // 国际动态
          const gjdt = {
            nav: { 'id': 19, 'name': '国际动态', 'enName': 'gjdt' },
            list: [],
          };
          const gjdtRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
            },
            order: [
              ['isRecom', 'DESC'],
              ['orderIndex', 'DESC'],
              ['conDate', 'DESC'],
            ],
            include: [{
              model: mysqlModel.Channel,
              where: { enName: 'gjdt' },
            }],
            pageSize: 6,
          });
          if (gjdtRes.status) {
            gjdt.list = gjdtRes.data.list;
          }
          newsTabList.push(gjdt);
          // 培训入口
          let trainingEntranceList = [];
          const traregRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
              'isRecom': 1,
            },
            order: [
              ['orderIndex', 'DESC'],
              ['conDate', 'DESC'],
            ],
            include: [{
              model: mysqlModel.Channel,
              where: { keyWord: '培训' },
            }],
            pageSize: 2,
          });
          if (traregRes.status) {
            trainingEntranceList = traregRes.data.list;
          }

          return {
            status: 1,
            data: { bannerList, headList, associationNewsList, newsTabList, trainingEntranceList },
          };
        },
    );
  };

  /*
  *                        _oo0oo_
  *                       o8888888o
  *                       88" . "88
  *                       (| -_- |)
  *                       0\  =  /0
  *                     ___/`---'\___
  *                   .' \\|     |// '.
  *                  / \\|||  :  |||// \
  *                 / _||||| -:- |||||- \
  *                |   | \\\  - /// |   |
  *                | \_|  ''\---/''  |_/ |
  *                \  .-\__  '-'  ___/-. /
  *              ___'. .'  /--.--\  `. .'___
  *           ."" '<  `.___\_<|>_/___.' >' "".
  *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
  *          \  \ `_.   \_ __\ /__ _/   .-` /  /
  *      =====`-.____`.___ \_____/___.-`___.-'=====
  *                        `=---='
  *
  *
  *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  *
  *            佛祖保佑       永不宕机     永无BUG
  */

  server.get(
      '/rest/menu',
      {
        schema: { tags: ['rest'], summary: '获取导航菜单' },
        config: { ChannelSettingModule: mysqlModel.ChannelSetting },
      },
      (request, reply) => channelMethod.getAll(request, reply),
  );

  server.get(
      '/rest/getCommonSettings',
      { schema: { tags: ['rest'], summary: '获取全局公共配置' } },
      (request, reply) => channelSettingMethod.getCommonSettings(request, reply),
  );

  server.get(
      '/rest/getHomePageData',
      {
        schema: { tags: ['rest'], summary: '获取首页数据' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
      },
      (request, reply) => getHomePageData(request, reply),
  );

  server.post(
      '/rest/getPubList',
      {
        schema: { ...querySchema, tags: ['rest'], summary: '按条件获取发布的文章列表' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
        preValidation: (request, reply, done) => {
          request.body = { ...request.body, pubStatus: '已发布' };
          done();
        },
      },
      (request, reply) => articleMethod.queryList(request, reply),
  );

  server.get(
      '/rest/headList',
      {
        schema: { tags: ['rest'], summary: '获取头条文章列表' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
        preValidation: (request, reply, done) => {
          request.body = { ...request.body, pubStatus: '已发布', isHead: true };
          done();
        },
      },
      (request, reply) => articleMethod.getById(request, reply),
  );

  server.get(
      '/rest/recomList',
      {
        schema: { tags: ['rest'], summary: '获取推荐文章列表' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
        preValidation: (request, reply, done) => {
          request.body = { ...request.body, pubStatus: '已发布', isRecom: true };
          done();
        },
      },
      (request, reply) => articleMethod.queryList(request, reply),
  );

  server.get(
      '/rest/content/:id',
      {
        schema: { ...getByIdSchema, tags: ['rest'], summary: '按ID获取文章内容' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
        preValidation: (request, reply, done) => {
          const { id } = request.params;
          request.body = { id, pubStatus: '已发布' };
          done();
        },
      },
      (request, reply) => articleMethod.findOne(request, reply),
  );

  server.put(
      '/rest/training/reg',
      { schema: { ...trainingregSchema, tags: ['rest'], summary: '培训报名' } },
      (request, reply) => trainingRegMethod.create(request, reply),
  );

  server.put(
      '/rest/memberCompany/reg',
      {
        schema: { ...memberCompanyRegSchema, tags: ['rest'], summary: '企业会员注册' },
        config: { MemberTypeModel: mysqlModel.MemberType },
      },
      (request, reply) => memberCompanyMethod.create(request, reply),
  );

  server.put(
      '/rest/memberIndivic/reg',
      {
        schema: { ...memberIndivicRegSchema, tags: ['rest'], summary: '个人会员注册' },
        config: { MemberTypeModel: mysqlModel.MemberType },
      },
      (request, reply) => memberIndivicMethod.create(request, reply),
  );

  server.put(
      '/rest/putServiceRequest',
      { schema: { ...putServiceRequestSchema, tags: ['rest'], summary: '发起服务申请' } },
      (request, reply) => serviceRequestMethod.create(request, reply),
  );

  next();
});
