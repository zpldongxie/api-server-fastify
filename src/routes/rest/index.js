/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2020-11-09 00:16:01
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { CommonMethod, commonCatch, onRouteError } = require('../util');
// const { queryByCid, queryAll } = require('../content/query-list-method');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const channelMethod = new CommonMethod(mysqlModel.Channel);
  const articleMethod = new CommonMethod(mysqlModel.Article);
  const trainingRegMethod = new CommonMethod(mysqlModel.TrainingReg);
  const { ajv } = opts;

  const querySchema = require('./query-content-list-schema');
  const getByIdSchema = require('./query-content-by-id-schema');
  const trainingregSchema = require('./trainingreg-schema');

  /**
   * 获取菜单
   *
   * @param {*} req
   * @param {*} reply
   */
  const getMenu = async (req, reply) => {
    const runFun = async () => {
      channelMethod.findAll(
          reply,
          {
            order: [['orderIndex', 'DESC']],
          },
      );
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 按条件获取发布的文章列表
   *
   * @param {*} req
   * @param {*} reply
   * @return {*}
   */
  const getPubList = async (req, reply) => {
    const validate = ajv.compile(querySchema.body.valueOf());
    const valid = validate(req.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const {
        channelId,
        current = 1,
        pageSize = 20,
        orderName,
        orderValue,
      } = req.body;
      const attributes = {
        exclude: ['mainCon'],
      };
      const sorter = {
        'orderIndex': 'desc',
        'conDate': 'desc',
      };
      if (orderName) {
        sorter[orderName] = (orderValue && orderValue.toLowerCase() === 'desc') ? 'desc' : 'asc';
      }
      const include = [
        {
          model: mysqlModel.Channel,
          attributes: ['id', 'name', 'enName'],
          where: {
            id: channelId,
          },
        },
        {
          model: mysqlModel.ArticleExtension,
          attributes: ['title', 'info', 'remark'],
        },
      ];
      articleMethod.queryList(
          reply,
          {
            'pubStatus': '已发布',
          },
          current, pageSize, sorter, null, include, attributes,
      );
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 获取头条文章列表
   *
   * @param {*} req
   * @param {*} reply
   */
  const getHeadList = async (req, reply) => {
    const runFun = async () => {
      const where = {
        'pubStatus': '已发布',
        'isHead': true,
      };
      const sorter = {
        'orderIndex': 'desc',
        'conDate': 'desc',
      };
      const attributes = {
        exclude: ['mainCon'],
      };
      const include = [
        {
          model: mysqlModel.Channel,
          attributes: ['id', 'name', 'enName'],
        },
        {
          model: mysqlModel.ArticleExtension,
          attributes: ['title', 'info', 'remark'],
        },
      ];
      articleMethod.queryList(reply, where, 1, 6, sorter, null, include, attributes);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 获取推荐文章列表
   *
   * @param {*} req
   * @param {*} reply
   */
  const getRecomList = async (req, reply) => {
    const runFun = async () => {
      const where = {
        'pubStatus': '已发布',
        'isRecom': true,
      };
      const sorter = {
        'orderIndex': 'desc',
        'conDate': 'desc',
      };
      const attributes = {
        exclude: ['mainCon'],
      };
      const include = [
        {
          model: mysqlModel.Channel,
          attributes: ['id', 'name', 'enName'],
        },
        {
          model: mysqlModel.ArticleExtension,
          attributes: ['title', 'info', 'remark'],
        },
      ];
      articleMethod.queryList(reply, where, 1, 6, sorter, null, include, attributes);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 根据ID获取文章信息
   *
   * @param {*} req
   * @param {*} reply
   */
  const getContent = async (req, reply) => {
    const runFun = async () => {
      const id = req.params.id;
      const include = [
        {
          model: mysqlModel.Channel,
          attributes: ['id', 'name', 'enName'],
        },
        {
          model: mysqlModel.ArticleExtension,
          attributes: ['title', 'info', 'remark'],
        },
      ];
      articleMethod.findOne(reply, id, include);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 培训报名
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const trainingReg = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(trainingregSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const { TrainingId, mobile } = request.body;
      const res = await trainingRegMethod.dao.findAll({ where: { TrainingId, mobile } });
      if (res.status && res.data.length) {
        return onRouteError(reply, { status: 200, message: '该手机号已经提交过申请，请不要重复提交' });
      }
      await trainingRegMethod.create(reply, request.body);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
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
      { schema: { tags: ['rest'], summary: '获取导航菜单' } },
      getMenu,
  );

  // 按条件获取发布的文章列表
  server.post(
      '/rest/getPubList',
      { schema: { ...querySchema, tags: ['rest'], summary: '按条件获取发布的文章列表' } },
      getPubList,
  );

  // 获取头条文章列表
  server.get(
      '/rest/headList',
      { schema: { tags: ['rest'], summary: '获取头条文章列表' } },
      getHeadList,
  );

  // 获取推荐文章列表
  server.get(
      '/rest/recomList',
      { schema: { tags: ['rest'], summary: '获取推荐文章列表' } },
      getRecomList,
  );

  // 按ID获取文章内容
  server.get(
      '/rest/content/:id',
      { schema: { ...getByIdSchema, tags: ['rest'], summary: '按ID获取文章内容' } },
      getContent,
  );

  // 培训报名
  server.put(
      '/rest/training/reg',
      { schema: { ...trainingregSchema, tags: ['rest'], summary: '培训报名' } },
      trainingReg,
  );

  next();
});
