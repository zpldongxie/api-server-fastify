/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-02-06 14:23:57
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'TrainingReg',
  modelName_L: 'trainingreg',
  getURL: '/api/trainingreg/:id',
  getAllURL: '/api/trainingregs',
  getListURL: '/api/getTrainingRegList',
  putURL: '/api/trainingreg',
  setPassedURL: '/api/trainingreg/setPassed',
  deleteURL: '/api/trainingregs',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { Channel, Training } = mysqlModel;
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
        schema: { ...getByIdSchema, tags: ['trainingreg'], summary: '根据ID获取单个' },
        config: { TrainingModule: Training },
      },
      (request, reply) => method.getById(request, reply),
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['trainingreg'], summary: '获取所有' },
        config: { TrainingModule: Training },
      },
      (request, reply) => method.getAll(request, reply),
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['trainingreg'], summary: '根据条件获取列表' },
        config: { TrainingModule: Training, ChannelModule: Channel },
      },
      (request, reply) => method.queryList(request, reply),
  );

  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['trainingreg'], summary: '新增或更新' } },
      (request, reply) => method.upsert(request, reply),
  );

  const setPassedSchema = require('./set-passed-schema');
  server.post(routerBaseInfo.setPassedURL,
      { schema: { ...setPassedSchema, tags: ['trainingreg'], summary: '设置审核状态' } },
      (request, reply) => method.setPassed(request, reply),
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['trainingreg'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
