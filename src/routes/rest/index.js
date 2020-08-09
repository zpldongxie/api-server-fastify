/*
 * @description rest接口，不做身份验证，其他系统使用的路由要加验证
 * @author: zpl
 * @Date: 2020-07-30 11:26:02
 * @LastEditTime: 2020-08-07 14:00:56
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {queryByCid, queryAll} = require('../content/query-list-method');
const {onRouteError} = require('../util');

const querySchema = require('./query-content-list-schema');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const {ajv} = opts;

  // 按条件获取发布的文章列表
  server.post('/getPubList', {schema: querySchema}, async (req, reply) => {
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
        search: {pubStatus: '已发布'},
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
      const result = await queryAll({mysqlModel, search: {pubStatus: '已发布', isRecom: true}});
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

  // 新增或更新培训
  const putTrainingRegSchema = require('./put-training-reg-schema');
  server.put('/trainingReg', {schema: putTrainingRegSchema}, async (request, reply) => {
    const validate = ajv.compile(putTrainingRegSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }
    try {
      const training = await mysqlModel.Training.findOne({where: {id: request.body.TrainingId}});
      if (training) {
        const trainingReg = await mysqlModel.TrainingReg.create(request.body);
        if (trainingReg) {
          return reply.code(201).send({message: '报名成功，请注意查收审批回复邮件。'});
        }
        return reply.code(422).send('培训报名创建失败。');
      } else {
        reply.code(200).send({
          status: 'error',
          message: '指定培训不存在，无法创建报名。',
        });
      }
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  next();
});
