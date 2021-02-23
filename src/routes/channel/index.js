/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-02-04 09:36:54
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'Channel',
  modelName_L: 'channel',
  getURL: '/api/channel/:id',
  getAllURL: '/api/channels',
  getByShowStatusURL: '/api/channels/show/:showStatus',
  getByTypeURL: '/api/channels/type/:typeName',
  getListURL: '/api/getChannelList',
  putURL: '/api/channel',
  putShowStatusURL: '/api/channel/showStatus',
  putSettingExtendURL: '/api/channel/settingExtend',
  moveURL: '/api/channel/move',
  deleteURL: '/api/channels',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const ChannelTypeModule = mysqlModel.ChannelType;
  const ChannelSettingModule = mysqlModel.ChannelSetting;
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

  const getByIdSchema = require('./query-by-id-schema');
  server.get(
      routerBaseInfo.getURL,
      {
        schema: { ...getByIdSchema, tags: ['channel'], summary: '根据ID获取单个' },
        config: { ChannelTypeModule, ChannelSettingModule },
      },
      (request, reply) => method.getById(request, reply),
  );

  server.get(
      routerBaseInfo.getAllURL,
      {
        schema: { tags: ['channel'], summary: '获取所有' },
        config: { ChannelTypeModule, ChannelSettingModule },
      },
      (request, reply) => method.getAll(request, reply),
  );

  const showFilterSchema = require('./show-filter-schema');
  server.get(
      routerBaseInfo.getByShowStatusURL,
      {
        schema: { ...showFilterSchema, tags: ['channel'], summary: '显示状态过滤查找栏目' },
        config: { ChannelTypeModule, ChannelSettingModule },
      },
      (request, reply) => method.getByShowStatus(request, reply),
  );

  const typeFilterSchema = require('./type-filter-schema');
  server.get(
      routerBaseInfo.getByTypeURL,
      {
        schema: { ...typeFilterSchema, tags: ['channel'], summary: '栏目类型名称过滤查找栏目' },
        config: { ChannelTypeModule, ChannelSettingModule },
      },
      (request, reply) => method.getByTypeName(request, reply),
  );

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      {
        schema: { ...queryListSchema, tags: ['channel'], summary: '根据条件获取列表' },
        config: { ChannelTypeModule, ChannelSettingModule },
      },
      (request, reply) => method.queryList(request, reply),
  );

  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['channel'], summary: '新增或更新' } },
      (request, reply) => method.upsert(request, reply),
  );

  const setShowStatusSchema = require('./set-showstatus-schema');
  server.put(routerBaseInfo.putShowStatusURL,
      { schema: { ...setShowStatusSchema, tags: ['channel'], summary: '设置显示状态' } },
      (request, reply) => method.setShowStatus(request, reply),
  );

  const setSettingExtendSchema = require('./set-setting-extend-schema');
  server.put(routerBaseInfo.putSettingExtendURL,
      { schema: { ...setSettingExtendSchema, tags: ['channel'], summary: '设置栏目配置继承状态' } },
      (request, reply) => method.setSettingExtend(request, reply),
  );

  const moveSchema = require('./move-schema');
  server.post(routerBaseInfo.moveURL,
      { schema: { ...moveSchema, tags: ['channel'], summary: '移动栏目' } },
      (request, reply) => method.move(request, reply),
  );

  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['channel'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
