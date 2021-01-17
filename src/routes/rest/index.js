/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2021-01-17 20:43:59
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { onRouterSuccess, onRouterError } = require('../../util');
const ChannelMethod = require('../channel/method');
const ArticleMethod = require('../article/method');
const TrainingRegMethod = require('../trainingreg/method');
const MemberCompanyMethod = require('../membercompany/method');
const MemberIndivicMethod = require('../memberindivic/method');
const ServiceRequestMethod = require('../servicerequest/method');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { ajv } = opts;
  const channelMethod = new ChannelMethod(mysqlModel.Channel, ajv);
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
          // 推荐轮播
          const recomListRes = await articleMethod.dbMethod.queryList({
            where: {
              'pubStatus': '已发布',
              'isRecom': true,
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
          let recomList = [];
          if (recomListRes.status) {
            recomList = recomListRes.data.list;
          }
          // 协会动态
          const associationNewsList = [];
          // tab页
          const newsTabList = [];
          // 省内动态
          const sndt = {
            nav: { 'id': 17, 'name': '省内动态', 'enName': 'sndt' },
            list: [],
          };
          newsTabList.push(sndt);
          // 国内动态
          const gndt = {
            nav: { 'id': 18, 'name': '国内动态', 'enName': 'gndt' },
            list: [],
          };
          newsTabList.push(gndt);
          // 国际动态
          const gjdt = {
            nav: { 'id': 19, 'name': '国际动态', 'enName': 'gjdt' },
            list: [],
          };
          newsTabList.push(gjdt);
          // 培训入口
          const trainingEntranceList = [];
          // 产品列表
          const productsList = [];

          return {
            status: 1,
            data: { bannerList, recomList, associationNewsList, newsTabList, trainingEntranceList, productsList },
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

  // 获取菜单
  server.get(
      '/rest/menu',
      {
        schema: { tags: ['rest'], summary: '获取导航菜单' },
        config: { ChannelSettingModule: mysqlModel.ChannelSetting },
      },
      (request, reply) => channelMethod.getAll(request, reply),
  );

  // 获取首页数据
  server.get(
      '/rest/getHomePageData',
      {
        schema: { tags: ['rest'], summary: '获取首页数据' },
        config: { ChannelModel: mysqlModel.Channel, ArticleExtensionModel: mysqlModel.ArticleExtension },
      },
      (request, reply) => getHomePageData(request, reply),
  );

  // 按条件获取发布的文章列表
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

  // 获取头条文章列表
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

  // 获取推荐文章列表
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

  // 按ID获取文章内容
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

  // 培训报名
  server.put(
      '/rest/training/reg',
      { schema: { ...trainingregSchema, tags: ['rest'], summary: '培训报名' } },
      (request, reply) => trainingRegMethod.create(request, reply),
  );

  // 企业会员注册
  server.put(
      '/rest/memberCompany/reg',
      {
        schema: { ...memberCompanyRegSchema, tags: ['rest'], summary: '企业会员注册' },
        config: { MemberTypeModel: mysqlModel.MemberType },
      },
      (request, reply) => memberCompanyMethod.create(request, reply),
  );

  // 个人会员注册
  server.put(
      '/rest/memberIndivic/reg',
      {
        schema: { ...memberIndivicRegSchema, tags: ['rest'], summary: '个人会员注册' },
        config: { MemberTypeModel: mysqlModel.MemberType },
      },
      (request, reply) => memberIndivicMethod.create(request, reply),
  );

  // 发起服务申请
  server.put(
      '/rest/putServiceRequest',
      { schema: { ...putServiceRequestSchema, tags: ['rest'], summary: '发起服务申请' } },
      (request, reply) => serviceRequestMethod.create(request, reply),
  );

  next();
});
