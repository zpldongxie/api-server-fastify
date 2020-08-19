/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2020-08-09 16:35:13
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { findAll, findOne, findSome, create, updateOne, updateMany, deleteSome } = require('../../modules/mysql/dao');
const { queryByCid, queryAll } = require('../content/query-list-method');
const { onRouteError } = require('../util');

const querySchema = require('./query-content-list-schema');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { ajv } = opts;

  // 按条件获取发布的文章列表
  server.post('/getPubList', { schema: querySchema }, async (req, reply) => {
    const validate = ajv.compile(querySchema.body.valueOf());
    const valid = validate(req.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const {
        channelId,
        current = 1,
        pageSize = 20,
      } = req.body;
      const result = await queryByCid({
        mysqlModel,
        channelId,
        search: { pubStatus: '已发布' },
        pageSize,
        current,
      });
      return reply.code(200).send(result);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取推荐文章
  server.get('/recomList', {}, async (req, reply) => {
    try {
      const result = await queryAll({ mysqlModel, search: { pubStatus: '已发布', isRecom: true } });
      return reply.code(200).send(result);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取单片文章
  server.get('/channelSingleContent/:id', {}, async (req, reply) => {
    try {
      const id = req.params.id;
      const channel = await mysqlModel.Channel.findOne({
        where: {
          id,
          channelType: '单篇文章',
        },
        include: {
          model: mysqlModel.ContentDetail,
          where: {
            pubStatus: '已发布',
          },
        },
      });
      if (channel) {
        const content = channel.ContentDetails.length ? channel.ContentDetails[0] : {};
        reply.code(200).send(content);
      } else {
        reply.code(404);
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 按ID获取文章内容
  server.get('/content/:id', {}, async (req, reply) => {
    try {
      const id = req.params.id;
      const content = await mysqlModel.ContentDetail.findOne({
        where: {
          id,
          pubStatus: '已发布',
        },
        include: {
          model: mysqlModel.Channel,
          attributes: ['id', 'name'],
        },
      });
      if (content) {
        reply.code(200).send(content);
      } else {
        reply.code(404);
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 培训报名
  const putTrainingRegSchema = require('./put-training-reg-schema');
  server.put('/trainingReg', { schema: putTrainingRegSchema }, async (request, reply) => {
    const validate = ajv.compile(putTrainingRegSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const trainingResult = await findOne(mysqlModel.Training)({ id: request.body.TrainingId });
    if (trainingResult.status) {
      const result = await create(mysqlModel.TrainingReg)(request.body);
      if (result.status) {
        return reply.code(201).send(result);
      }
      return reply.code(422).send(result);
    }
    return reply.code(422).send({
      status: 'error',
      message: '指定培训不存在，无法创建报名。',
    });
  });

  next();
});
