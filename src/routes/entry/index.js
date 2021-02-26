/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-02-26 09:12:54
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'Entry',
  modelName_L: 'entry',
  getURL: '/api/entry/:id',
  getAllURL: '/api/entrys',
  getListURL: '/api/getEntryList',
  putURL: '/api/entry',
  deleteURL: '/api/entrys',
  auditURL: '/api/entry/audit',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const ChannelModel = mysqlModel.Channel;
  const sysConfigModel = mysqlModel.SysConfig;
  const { ajv } = opts;
  const method = new Method(CurrentModel, ajv);
  const channelDBMethod = new Method(ChannelModel, ajv).dbMethod;


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
        schema: { ...getByIdSchema, tags: ['entry'], summary: '根据ID获取单个' },
      },
      (request, reply) => method.getById(request, reply),
  );

  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['entry'], summary: '获取所有' },
        config: { ChannelModel },
      },
      (request, reply) => method.getAll(request, reply),
  );

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['entry'], summary: '根据条件获取列表' },
        config: { ChannelModel },
      },
      (request, reply) => method.queryList(request, reply),
  );

  const updateSchema = require('./update-schema');
  server.put(
      routerBaseInfo.putURL,
      {
        schema: { ...updateSchema, tags: ['entry'], summary: '新增或更新' },
        config: { ChannelModel, channelDBMethod },
      },
      (request, reply) => method.upsert(request, reply),
  );

  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['entry'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  // 审核
  const auditSchema = require('./audit-schema');
  server.put(routerBaseInfo.auditURL,
      {
        schema: { ...auditSchema, tags: ['entry'], summary: '审核' },
        config: { ...sysConfigModel, nodemailer: server.nodemailer },
      },
      (request, reply) => method.audit(request, reply),
  );
  next();
});
