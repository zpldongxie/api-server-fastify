/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-02-26 09:02:41
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Method = require('./method');

const routerBaseInfo = {
  modelName_U: 'Article',
  modelName_L: 'article',
  getURL: '/api/article/:id',
  getAllURL: '/api/articles',
  getListURL: '/api/getArticleList',
  putURL: '/api/article',
  deleteURL: '/api/articles',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
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
        schema: { ...getByIdSchema, tags: ['article'], summary: '根据ID获取单个' },
      },
      async (request, reply) => {
        await method.run(request, reply)(
            async () => {
              const id = request.params.id;
              return await method.getById(id);
            },
        );
      },
  );

  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['article'], summary: '获取所有' } },
      async (request, reply) => {
        await method.run(request, reply)(
            async () => {
              return await method.getAll();
            },
        );
      },
  );

  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['article'], summary: '根据条件获取列表' } },
      (request, reply) => method.queryList(request, reply),
  );

  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['article'], summary: '新增或更新' } },
      (request, reply) => method.upsert(request, reply),
  );

  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['article'], summary: '批量删除' } },
      (request, reply) => method.remove(request, reply),
  );

  next();
});
