/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-27 13:43:34
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'MemberIndivic',
  modelName_L: 'memberindivic',
  getURL: '/api/memberindivic/:id',
  getAllURL: '/api/memberindivics',
  getListURL: '/api/getMemberIndivicList',
  putURL: '/api/memberindivic',
  auditURL: '/api/memberindivic/audit',
  deleteURL: '/api/memberindivics',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const MemberTypeModel = mysqlModel.MemberType;
  const sysConfigModel = mysqlModel.SysConfig;
  const { ajv } = opts;
  const method = new Method(CurrentModel, ajv);


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
        schema: { ...getByIdSchema, tags: ['memberindivic'], summary: '根据ID获取单个个人会员' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['memberindivic'], summary: '获取所有个人会员' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['memberindivic'], summary: '根据条件获取个人会员列表' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.queryList(request, reply),
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      {
        schema: { ...updateSchema, tags: ['memberindivic'], summary: '新增或更新个人会员' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.upsert(request, reply),
  );

  // 审核
  const auditSchema = require('./audit-schema');
  server.put(routerBaseInfo.auditURL,
      {
        schema: { ...auditSchema, tags: ['memberindivic'], summary: '审核' },
        config: { sysConfigModel, nodemailer: server.nodemailer },
      },
      (request, reply) => method.audit(request, reply),
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['memberindivic'], summary: '批量删除个人会员' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
