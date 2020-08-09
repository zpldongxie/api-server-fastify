/*
 * @description: 文章管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-07-31 21:49:48
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const request = require('request');

const queryListSchema = require('./query-list-schema');

module.exports = fp(async (server, opts, next) => {
  // TODO: 根据ID获取文章信息
  server.get('/api/content/:id', {}, async (req, reply) => {
    try {
      const _id = req.params.id;

      const training = await server.db.models.TrainingReg.findOne({
        _id,
      });

      if (!training) {
        return reply.send(404);
      }

      return reply.code(200).send(training);
    } catch (error) {
      req.log.error(error);
      return reply.send(400);
    }
  });

  convertGetContentListParam = (param) => {
    const {
      pageSize = 10,
      current = 1,
      title='',
      // filter,
      sorter={'conDate': 'desc'}, // 默认以时间降序排序
      channelId,
    } = param;

    // 排序参数
    const sorterKeys = Object.keys(sorter);
    const orderName = sorterKeys.length ? sorterKeys[0] : 'conDate';
    let orderValue = sorterKeys.length ? sorter[sorterKeys[0]] : 'desc';
    orderValue = orderValue === 'ascend' ? 'asc' : 'desc';

    return {
      channelId,
      contentType: 'content',
      length: pageSize,
      orderName,
      orderValue,
      search: title,
      start: (current - 1) * pageSize,
    };
  };

  // 获取所有文章信息
  server.post('/api/getContentList', {
    schema: queryListSchema,
  }, async (req, reply) => {
    const queryContentListParams = convertGetContentListParam(req.body);
    try {
      request({
        url: `${opts}/getContentList`,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(queryContentListParams),
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          return reply.code(200).send(JSON.parse(body));
        }
        req.log.error(error);
        return reply.send(500);
      });
    } catch (error) {
      req.log.error(error);
      return reply.send(500);
    }
  });

  // TODO: 新增或更新文章
  server.post('/api/content', {}, async (req, reply) => {
    try {
      const {TrainingReg} = server.db.models;

      const training = await TrainingReg.create(req.body);

      return reply.code(201).send(training);
    } catch (error) {
      req.log.error(error);
      return reply.send(500);
    }
  });

  next();
});
