/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2020-09-23 15:25:54
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { CommonMethod, commonCatch } = require('../util');
// const { queryByCid, queryAll } = require('../content/query-list-method');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const channelMethod = new CommonMethod(mysqlModel.Channel);
  const articleMethod = new CommonMethod(mysqlModel.Article);
  const { ajv } = opts;

  server.get(
      '/rest/menu',
      {
        schema: { tags: ['rest'], summary: '获取导航菜单' },
      }, async (req, reply) => {
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
      },
  );

  // 按条件获取发布的文章列表
  const querySchema = require('./query-content-list-schema');
  server.post(
      '/rest/getPubList',
      { schema: { ...querySchema, tags: ['rest'], summary: '按条件获取发布的文章列表' } },
      async (req, reply) => {
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
          const sorter = {};
          if (orderName) {
            sorter[orderName] = (orderValue && orderValue.toLowerCase() === 'desc') ? 'desc' : 'asc';
          }
          const include = {
            model: mysqlModel.Channel,
            attributes: ['id', 'name'],
            where: {
              id: channelId,
            },
          };
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
      },
  );

  // 获取头条文章列表
  server.get(
      '/rest/headList',
      { schema: { tags: ['rest'], summary: '获取头条文章列表' } },
      async (req, reply) => {
        const runFun = async () => {
          const where = {
            'pubStatus': '已发布',
            'isHead': true,
          };
          const sorter = {};
          const attributes = {
            exclude: ['mainCon'],
          };
          articleMethod.queryList(reply, where, 1, 6, sorter, null, null, attributes);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 获取推荐文章列表
  server.get(
      '/rest/recomList',
      { schema: { tags: ['rest'], summary: '获取推荐文章列表' } },
      async (req, reply) => {
        const runFun = async () => {
          const where = {
            'pubStatus': '已发布',
            'isRecom': true,
          };
          const sorter = {};
          const attributes = {
            exclude: ['mainCon'],
          };
          articleMethod.queryList(reply, where, 1, 6, sorter, null, null, attributes);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // // 获取单片文章
  // server.get('/channelSingleContent/:id', {}, async (req, reply) => {
  //   try {
  //     const id = req.params.id;
  //     const channel = await mysqlModel.Channel.findOne({
  //       where: {
  //         id,
  //         channelType: '单篇文章',
  //       },
  //       include: {
  //         model: mysqlModel.ContentDetail,
  //         where: {
  //           pubStatus: '已发布',
  //         },
  //       },
  //     });
  //     if (channel) {
  //       const content = channel.ContentDetails.length ? channel.ContentDetails[0] : {};
  //       reply.code(200).send(content);
  //     } else {
  //       reply.code(404);
  //     }
  //   } catch (error) {
  //     return onRouteError(error, reply);
  //   }
  // });

  // // 按ID获取文章内容
  // server.get('/content/:id', {}, async (req, reply) => {
  //   try {
  //     const id = req.params.id;
  //     const content = await mysqlModel.ContentDetail.findOne({
  //       where: {
  //         id,
  //         pubStatus: '已发布',
  //       },
  //       include: {
  //         model: mysqlModel.Channel,
  //         attributes: ['id', 'name'],
  //       },
  //     });
  //     if (content) {
  //       reply.code(200).send(content);
  //     } else {
  //       reply.code(404);
  //     }
  //   } catch (error) {
  //     return onRouteError(error, reply);
  //   }
  // });

  // // 培训报名
  // const putTrainingRegSchema = require('./put-training-reg-schema');
  // server.put('/trainingReg', { schema: putTrainingRegSchema }, async (request, reply) => {
  //   const validate = ajv.compile(putTrainingRegSchema.body.valueOf());
  //   const valid = validate(request.body);
  //   if (!valid) {
  //     return reply.code(400).send(validate.errors);
  //   }

  //   const trainingResult = await findOne(mysqlModel.Training)({ id: request.body.TrainingId });
  //   if (trainingResult.status) {
  //     const result = await create(mysqlModel.TrainingReg)(request.body);
  //     if (result.status) {
  //       return reply.code(201).send(result);
  //     }
  //     return reply.code(422).send(result);
  //   }
  //   return reply.code(422).send({
  //     status: 'error',
  //     message: '指定培训不存在，无法创建报名。',
  //   });
  // });

  next();
});
