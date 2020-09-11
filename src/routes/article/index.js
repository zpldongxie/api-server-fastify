/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-09-11 22:15:46
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { commonCatch, CommonMethod, transaction } = require('../util');

const routerBaseInfo = {
  modelName_U: 'Article',
  modelName_L: 'article',
  getURL: '/api/article/:id',
  getAllURL: '/api/articles',
  getListURL: '/api/getArticleList',
  putURL: '/api/article',
  deleteURL: '/api/articles',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);

  // 根据ID获取单个
  server.get(routerBaseInfo.getURL, { schema: { tags: ['article'] } }, async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      routerMethod.findOne(reply, id);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 获取所有
  server.get(routerBaseInfo.getAllURL, { schema: { tags: ['article'] } }, async (request, reply) => {
    const runFun = async () => {
      const conditions = {};
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  });

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['article'] } },
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
            sorter,
            filter,
            ...where
          } = request.body;
          const include = {};
          routerMethod.queryList(reply, where, current, pageSize, sorter, filter, include);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['article'] } },
      async (request, reply) => {
      // 参数校验
        const validate = ajv.compile(updateSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        // 执行方法
        const runFun = async () => {
          await routerMethod.upsert(reply, request.body);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['article'] } },
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
      { schema: { tags: ['article'] } },
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
