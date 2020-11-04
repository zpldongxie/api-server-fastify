/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-11-04 18:46:14
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const request = require('request');
const { commonCatch, CommonMethod, transaction, onRouterSuccess, onRouteError } = require('../util');
const { Dao } = require('../../modules/mysql/dao');

const routerBaseInfo = {
  modelName_U: 'Article',
  modelName_L: 'article',
  getURL: '/api/article/:id',
  getAllURL: '/api/articles',
  getListURL: '/api/getArticleList',
  putURL: '/api/article',
  setAttributURL: '/api/article/attribut',
  moveToURL: '/api/article/moveTo',
  deleteURL: '/api/articles',
  findNoAttributionURL: '/api/article/findNoAttribution',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const ChannelModel = mysqlModel.Channel;
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);
  const articleDao = new Dao(CurrentModel);
  const channelDao = new Dao(ChannelModel);

  /**
   * 根据ID获取单个文章
   *
   * @param {*} request
   * @param {*} reply
   */
  const getById = async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      const include = {
        model: mysqlModel.Channel,
        attributes: ['id', 'name'],
      };
      routerMethod.findOne(reply, id, include);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 获取所有文章
   *
   * @param {*} request
   * @param {*} reply
   */
  const getAll = async (request, reply) => {
    const runFun = async () => {
      const conditions = {
        attributes: {
          exclude: ['mainCon'],
        },
        include: {
          model: mysqlModel.Channel,
          attributes: ['id', 'name'],
        },
      };
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 根据条件获取文章列表
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const queryList = async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const {
        current,
        pageSize,
        sorter = {},
        filter,
        channelId,
        ...where
      } = request.body;

      if (!where.hasOwnProperty('pubStatus')) {
        where.pubStatus = { [Op.not]: '已删除' };
      }
      if (!sorter.hasOwnProperty('conDate')) {
        sorter.conDate = 'desc';
      }
      const include = {
        model: mysqlModel.Channel,
        attributes: ['id', 'name'],
      };
      const attributes = {
        exclude: ['mainCon'],
      };
      if (channelId) {
        include.where = {
          id: channelId,
        };
      }
      routerMethod.queryList(
          reply, where, current, pageSize, sorter, filter, include, attributes,
      );
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 新增或更新文章
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const upsert = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const params = {
        approvalStatus: '无需审核',
        pubStatus: '草稿',
        ...request.body,
      };
      const result = await articleDao.upsert(params);
      const cResult = await channelDao.findSome({ where: { id: { [Op.in]: params.Channels } } });
      if (!!result.status) {
        const article = result.data;
        if (cResult.status) {
          await article.setChannels(cResult.data.list.map((c)=>c.id));
        }
        onRouterSuccess(reply, article);
      } else {
        onRouteError(reply, '保存失败');
      }
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 批量移动文章
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const moveTo = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(moveToSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const { ids, cIds } = request.body;
      // TODO: 没有做栏目类型校验
      const aResult = await articleDao.findSome({ where: { id: { [Op.in]: ids } } });
      const cResult = await channelDao.findSome({ where: { id: { [Op.in]: cIds } } });
      if (aResult.status && cResult.status) {
        const channelIds = cResult.data.list.map((c)=>c.id);
        const articles = aResult.data.list;
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
          await article.setChannels(channelIds);
        }
        onRouterSuccess(reply);
      } else {
        onRouteError(reply, '所选栏目无效');
      }
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 批量设置文章属性
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const setAttr = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(setAttributSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const { ids, attr } = request.body;
      routerMethod.updateMany(reply, ids, attr);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 批量删除文章
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const remove = async (request, reply) => {
    const validate = ajv.compile(deleteSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const ids = request.body.ids;
      await routerMethod.delete(reply, ids);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 查找无归属文章
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const findNoAttributionArticle = async (request, reply) => {
    // 执行方法
    const runFun = async () => {
      const conditions = {
        attributes: {
          exclude: ['mainCon'],
        },
        include: {
          model: mysqlModel.Channel,
          attributes: ['id', 'name'],
        },
      };
      const aResult = await articleDao.findAll(conditions);
      if (aResult.status) {
        const articles = aResult.data;
        const list = articles.filter((article) => !article.Channels || !article.Channels.length);
        onRouterSuccess(reply, { total: list.length, list });
      } else {
        onRouteError(reply, '所选栏目无效');
      }
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

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      { schema: { ...getByIdSchema, tags: ['article'], summary: '根据ID获取单个文章' } },
      getById,
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['article'], summary: '获取所有文章' } },
      getAll,
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['article'], summary: '根据条件获取文章列表' } },
      queryList,
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['article'], summary: '新增或更新文章' } },
      upsert,
  );

  // 批量移动文章
  const moveToSchema = require('./move-to-schema');
  server.put(
      routerBaseInfo.moveToURL,
      { schema: { ...moveToSchema, tags: ['article'], summary: '批量移动文章' } },
      moveTo,
  );

  // 批量设置单个属性
  const setAttributSchema = require('./set-attr-schema');
  server.put(
      routerBaseInfo.setAttributURL,
      { schema: { ...setAttributSchema, tags: ['article'], summary: '批量设置文章属性' } },
      setAttr,
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['article'], summary: '批量删除文章' } },
      remove,
  );

  // 查找无归属文章
  server.get(
      routerBaseInfo.findNoAttributionURL,
      { schema: { tags: ['article'], summary: '查找无归属文章' } },
      findNoAttributionArticle,
  );

  // TODO: 后期删除
  const trans = transaction(server.sequelize);
  server.post(
      '/api/updateDatabase',
      { schema: { tags: ['article'], summary: '从旧文章表向新文章表同步数据，同一个库' } },
      async (request, reply) => {
        const runFun = async () => {
          console.log('查询旧文章表');
          // const cdcList = await mysqlModel['content_detail_channel'].findAll();
          const list = await mysqlModel.ContentDetail.findAll({});
          console.log('旧文章表数据条数： ', list.length);
          console.log('向新文章表插入内容...');
          const result = await trans(async (t) => {
            for (const content of list) {
              const channels = await content.getChannels();
              const newCon = {
                ...content.dataValues,
                createdAt: content.create_time,
                updatedAt: content.create_time,
              };
              delete newCon['id'];
              delete newCon['create_time'];
              const current = await CurrentModel.upsert(newCon);
              if (current[0]) {
                current[0].setChannels(channels);
              }
            }
            const newLength = await CurrentModel.count();
            console.log('同步完成: ', newLength);
            return newLength;
          });

          console.log('事务执行结束----------', result);

          reply.code(200).send({
            state: 'ok',
            total: result,
          });
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 同步文章表
  const updateArticle = async (channel) => {
    return new Promise((resolve, reject) => {
      request({
        url: `http://www.snains.cn:9000/getContentList`,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          channelId: channel.id,
          length: -1,
          start: 0,
        }),
      }, function(error, response, body) {
        if (error) {
          reject(error);
        }
        if (!error && response.statusCode == 200) {
          const contentList = JSON.parse(body).list;
          (async () => {
            // 新旧数据库映射关系，可以通过旧栏目名快速找到对就的新栏目名
            let channelName;
            switch (channel.name) {
              case '会费标准':
                channelName = '独立文章-隐藏';
                break;
              case '协会简介':
                channelName = '协会简介';
                break;
              case '协会动态':
                channelName = '协会动态';
                break;
              case '协会章程':
                channelName = '协会章程';
                break;
              case '组织机构':
                channelName = '组织机构';
                break;
              case '副理事长单位':
                channelName = '副理事长单位';
                break;
              case '理事单位':
                channelName = '理事单位';
                break;
              case '单位会员':
                channelName = '单位会员';
                break;
              case '个人会员':
                channelName = '个人会员';
                break;
              case '单位会员入会终审申请表':
                channelName = '单位会员入会';
                break;
              case '个人会员入会终审申请表':
                channelName = '个人会员入会';
                break;
              case '联系我们':
                channelName = '联系我们';
                break;
              case '行业动态':
                channelName = '国内动态';
                break;
              case '国内法律法规':
                channelName = '国内';
                break;
              case '国外法律法规':
                channelName = '国际';
                break;
              default:
                channelName = '未分类';
            }
            const cResult = await channelDao.findSome({ where: { name: channelName } });
            for (const content of contentList) {
              const {
                // eslint-disable-next-line no-unused-vars
                id,
                // eslint-disable-next-line no-unused-vars
                createTime,
                // eslint-disable-next-line no-unused-vars
                cId,
                ...params
              } = content;
              const result = await articleDao.upsert(params);
              if (result.status) {
                const article = result.data;
                if (cResult.status) {
                  await article.setChannels(cResult.data.list.map((c)=>c.id));
                }
              }
            }
          })();
          resolve(contentList);
          // onRouterSuccess(reply, JSON.parse(body));
        } else {
          reject(response);
        }
      });
    });
  };

  /**
   * 遍历所有旧库中的栏目
   *
   * @param {*} channelList
   */
  const findAllChannels = async (channelList) => {
    for (const channel of channelList) {
      const contentList = await updateArticle(channel);
      console.log(channel.name + ' 下有： ' + contentList.length + '条记录');
      if (channel.children && channel.children.length) {
        await findAllChannels(channel.children);
      }
    }
  };

  // TODO: 后期删除
  server.post(
      '/api/updateDatabaseFromOldDB',
      { schema: { tags: ['article'], summary: '从旧数据库中旧文章表向新库新文章表同步数据' } },
      async (_, reply) => {
        const runFun = async () => {
          console.log('----清空新表----');
          await CurrentModel.destroy({ where: {} });
          console.log('----新表已清空----');
          console.log('----查询旧栏目表----');
          request({
            url: `http://www.snains.cn:9000/getNavTree`,
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: '{}',
          }, function(error, response, body) {
            if (error) {
              console.log('----旧栏目表查询失败----');
              console.error(error);
              onRouteError(reply, error);
              return;
            }
            if (!error && response.statusCode == 200) {
              const channelList = JSON.parse(body).list;
              console.log('----旧栏目表查询完成----', channelList.length);
              console.log('----开始同步----');
              (async () => {
                await findAllChannels(channelList);
                console.log('----同步完成----');
                onRouterSuccess(reply, '同步完成');
              })();
            } else {
              console.log('----旧栏目表查询失败----');
              console.error(response);
              onRouteError(reply, response);
              return;
            }
          });
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  next();
});
