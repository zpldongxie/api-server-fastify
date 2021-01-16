/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-16 21:58:16
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'MemberCompany',
  modelName_L: 'membercompany',
  getURL: '/api/membercompany/:id',
  getAllURL: '/api/membercompanys',
  getListURL: '/api/getMemberCompanyList',
  putURL: '/api/membercompany',
  auditURL: '/api/membercompanys/audit',
  deleteURL: '/api/membercompanys',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const MemberTypeModel = mysqlModel.MemberType;
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
        schema: { ...getByIdSchema, tags: ['membercompany'], summary: '根据ID获取单个企业会员' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['membercompany'], summary: '获取所有企业会员' } },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['membercompany'], summary: '根据条件获取企业会员列表' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.queryList(request, reply),
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      {
        schema: { ...updateSchema, tags: ['membercompany'], summary: '新增或更新企业会员' },
        config: { MemberTypeModel },
      },
      (request, reply) => method.upsert(request, reply),
  );

  // 审核
  const auditSchema = require('./audit-schema');
  server.post(routerBaseInfo.auditURL,
      { schema: { ...auditSchema, tags: ['membercompany'], summary: '审核' } },
      (request, reply) => method.audit(request, reply),
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['membercompany'], summary: '批量删除企业会员' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
