/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-03-12 18:42:25
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName: 'Jurisdiction',
  getURL: '/api/jurisdiction/:id',
  getAllURL: '/api/jurisdictions',
  setReadURL: '/api/authority/setRead',
  setWriteURL: '/api/authority/setWrite',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const { ajv } = opts;
  const method = new Method(mysqlModel, routerBaseInfo.modelName, ajv);

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

  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      {
        schema: { ...getByIdSchema, tags: ['jurisdiction'], summary: '根据ID获取单个' },
      },
      (request, reply) => method.getById(request, reply),
  );

  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['jurisdiction'], summary: '获取所有' } },
      (request, reply) => method.getAll(request, reply),
  );

  const setReadSchema = require('./set-read-schema');
  server.put(
      routerBaseInfo.setReadURL,
      { schema: { ...setReadSchema, tags: ['jurisdiction'], summary: '设置可读权限' } },
      (request, reply) => method.setRead(request, reply),
  );

  const setWriteSchema = require('./set-write-schema');
  server.put(
      routerBaseInfo.setWriteURL,
      { schema: { ...setWriteSchema, tags: ['jurisdiction'], summary: '设置可写权限' } },
      (request, reply) => method.setWrite(request, reply),
  );

  next();
});
