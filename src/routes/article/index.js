/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-15 11:01:35
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { commonCatch, CommonMethod, transaction, onRouterSuccess } = require('../util');
const { Dao } = require('../../modules/mysql/dao');

const routerBaseInfo = {
  modelName_U: 'Article',
  modelName_L: 'article',
  getURL: '/api/article/:id',
  getAllURL: '/api/articles',
  getListURL: '/api/getArticleList',
  putURL: '/api/article',
  setAttributURL: '/api/article/attribut',
  deleteURL: '/api/articles',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const ChannelModel = mysqlModel.Channel;
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);
  const articleDao = new Dao(CurrentModel);
  const channelDao = new Dao(ChannelModel);

  // 根据ID获取单个
  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      { schema: { ...getByIdSchema, tags: ['article'], description: '根据ID获取单个文章' } },
      async (request, reply) => {
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
      },
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['article'], description: '获取所有文章' } },
      async (request, reply) => {
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
      },
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['article'], description: '根据条件获取文章列表' } },
      async (request, reply) => {
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
      },
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['article'], description: '新增或更新文章' } },
      async (request, reply) => {
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
          if (result.status) {
            const article = result.data;
            if (cResult.status) {
              await article.setChannels(cResult.data.list.map((c)=>c.id));
            }
            onRouterSuccess(reply, article);
          }
          onRouteError(reply, '保存失败');
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 批量设置单个属性
  const setAttributSchema = require('./set-attr-schema');
  server.put(
      routerBaseInfo.setAttributURL,
      { schema: { ...setAttributSchema, tags: ['article'], description: '批量设置单个文章属性' } },
      async (request, reply) => {
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
      },
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['article'], description: '批量删除文章' } },
      async (request, reply) => {
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
      },
  );

  const trans = transaction(server.sequelize);
  server.post(
      '/api/updateDatabase',
      { schema: { tags: ['article'], description: '从旧文章表向新文章表同步数据' } },
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

  next();
});
