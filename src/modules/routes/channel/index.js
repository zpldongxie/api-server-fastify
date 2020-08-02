/*
 * @description: 栏目管理相关路由
 * @author: zpl
 * @Date: 2020-07-23 11:41:05
 * @LastEditTime: 2020-08-01 21:28:10
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const {Op} = require('sequelize');

const {onRouteError} = require('../util');

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const {Channel, ContentDetail} = mysqlModel;
  // const {ajv} = opts;

  // TODO: 根据ID获取栏目
  server.get('/api/channel/:id', {}, async (req, reply) => {
    try {
      const id = req.params.id;

      const channel = mysqlModel.Channel.findOne({where: {id}});

      if (!channel) {
        return reply.send(404);
      }

      return reply.code(200).send(channel);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 获取所有栏目
  server.get('/api/channels', {}, async (req, reply) => {
    try {
      const list = await Channel.findAll();
      return reply.code(200).send(list);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // 按名称筛选栏目
  server.get('/api/channels/:filter', {}, async (req, reply) => {
    try {
      const filter = req.params.filter;
      const where = filter ? {keyWord: {[Op.substring]: filter}} : {};
      const list = await Channel.findAll({where, attributes: ['id', 'name']});
      return reply.code(200).send(list);
    } catch (error) {
      return onRouteError(error, reply);
    }
  });

  // TODO: 新增或更新文章
  server.post('/api/channel', {}, async (req, reply) => {
    try {
      return reply.code(201).send('暂未实现此功能');
    } catch (error) {
      req.log.error(error);
      return reply.send(500);
    }
  });

  next();
});
