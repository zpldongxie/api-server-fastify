/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-03-18 15:59:32
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName: 'PersonalQuality',
  getURL: '/api/personalquality/:id',
  getAllURL: '/api/personalqualitys',
  getListURL: '/api/getPersonalQualityList',
  saveOnRequestURL: '/api/personalquality/saveOnRequest',
  deleteURL: '/api/personalqualitys',
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
        schema: { ...getByIdSchema, tags: ['personalquality'], summary: '根据ID获取单个' },
      },
      (request, reply) => method.getById(request, reply),
  );

  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['personalquality'], summary: '获取所有' } },
      (request, reply) => method.getAll(request, reply),
  );

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['personalquality'], summary: '根据条件获取列表' } },
      (request, reply) => method.queryList(request, reply),
  );

  const saveOnRequestSchema = require('./save-on-request-schema');
  server.put(routerBaseInfo.saveOnRequestURL,
      { schema: { ...saveOnRequestSchema, tags: ['personalquality'], summary: '保存到申请中' } },
      (request, reply) => method.saveOnRequest(request, reply),
  );

  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['personalquality'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
