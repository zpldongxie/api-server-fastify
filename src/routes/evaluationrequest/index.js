/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-03-24 16:20:47
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName: 'EvaluationRequest',
  getURL: '/api/evaluationrequest/:id',
  getAllURL: '/api/evaluationrequests',
  getListURL: '/api/getEvaluationRequestList',
  getListForCurrentUserURL: '/api/er/getList/current',
  getListForAuditorURL: '/api/er/getList/auditor',
  initialURL: '/api/evaRequest/initial',
  saveBasicTechnologyURL: '/api/evaRequest/saveBasicTechnology',
  deleteURL: '/api/evaluationrequests',
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
        schema: { ...getByIdSchema, tags: ['evaluationrequest'], summary: '根据ID获取单个' },
      },
      (request, reply) => method.getById(request, reply),
  );

  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['evaluationrequest'], summary: '获取所有' } },
      (request, reply) => method.getAll(request, reply),
  );

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['evaluationrequest'], summary: '根据条件获取列表' } },
      (request, reply) => method.queryList(request, reply),
  );

  server.post(
      routerBaseInfo.getListForCurrentUserURL,
      {
        preValidation: [server.authenticate],
        schema: { ...queryListSchema, tags: ['evaluationrequest'], summary: '根据条件获取当前用户申请列表' },
      },
      (request, reply) => method.getListForCurrentUser(request, reply),
  );

  server.post(
      routerBaseInfo.getListForAuditorURL,
      {
        preValidation: [server.authenticate],
        schema: { ...queryListSchema, tags: ['evaluationrequest'], summary: '根据条件获取当前用户待审核列表' },
      },
      (request, reply) => method.getListForAuditor(request, reply),
  );

  const initialRequestSchema = require('./initial-request-schema');
  server.put(
      routerBaseInfo.initialURL,
      {
        preValidation: [server.authenticate],
        schema: { ...initialRequestSchema, tags: ['evaluationrequest'], summary: '初次申请' },
      },
      (request, reply) => method.initialRequest(request, reply),
  );

  const saveBasicTechnologySchema = require('./save-basic-technology-schema');
  server.put(
      routerBaseInfo.saveBasicTechnologyURL,
      {
        preValidation: [server.authenticate],
        schema: { ...saveBasicTechnologySchema, tags: ['evaluationrequest'], summary: '保存基本技术能力' },
      },
      (request, reply) => method.saveBasicTechnology(request, reply),
  );

  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['evaluationrequest'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
