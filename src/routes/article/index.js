/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-14 17:34:51
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const CommonMethod = require('../commonMethod');
const Method = require('./method');

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
  const ArticleExtensionModel = mysqlModel.ArticleExtension;
  const { ajv } = opts;
  const method = new Method(CurrentModel, ajv);
  const channelDBMethod = new Method(ChannelModel, ajv).dbMethod;
  const articleExtensionDBMethod = new Method(ArticleExtensionModel, ajv).dbMethod;


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
      {
        schema: { ...getByIdSchema, tags: ['article'], summary: '根据ID获取单个' },
        config: {
          ChannelModel,
          ArticleExtensionModel,
        },
      },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['article'], summary: '获取所有' },
        config: {
          ChannelModel,
          ArticleExtensionModel,
        },
      },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['article'], summary: '根据条件获取列表' },
        config: {
          ChannelModel,
          ArticleExtensionModel,
        },
      },
      (request, reply) => method.queryList(request, reply),
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      {
        schema: { ...updateSchema, tags: ['article'], summary: '新增或更新' },
        config: {
          channelDBMethod,
          articleExtensionDBMethod,
        },
      },
      (request, reply) => method.upsert(request, reply),
  );

  // 批量移动文章
  const moveToSchema = require('./move-to-schema');
  server.put(
      routerBaseInfo.moveToURL,
      {
        schema: { ...moveToSchema, tags: ['article'], summary: '批量移动文章' },
        config: {
          channelDBMethod,
        },
      },
      (request, reply) => method.moveTo(request, reply),
  );

  // 批量设置单个属性
  const setAttributSchema = require('./set-attr-schema');
  server.put(
      routerBaseInfo.setAttributURL,
      { schema: { ...setAttributSchema, tags: ['article'], summary: '批量设置文章属性' } },
      (request, reply) => method.setAttr(request, reply),
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['article'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  // 查找无归属文章
  server.get(
      routerBaseInfo.findNoAttributionURL,
      {
        schema: { tags: ['article'], summary: '查找无归属文章' },
        config: {
          ChannelModel,
        },
      },
      (request, reply) => method.findNoAttributionArticle(request, reply),
  );

  // TODO: 后期删除
  const trans = CommonMethod.transaction(server.sequelize);
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
            const cResult = await channelDBMethod.queryList({ where: { name: channelName } });
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
              onRouterError(reply, error);
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
              onRouterError(reply, response);
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
