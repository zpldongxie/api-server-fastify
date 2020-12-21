/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2020-11-04 17:59:04
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { commonCatch, CommonMethod } = require('../util');

const routerBaseInfo = {
  modelName_U: 'OtherResult',
  modelName_L: 'otherresult',
  getURL: '/api/otherresult/:id',
  getAllURL: '/api/otherresults',
  getListURL: '/api/getOtherResultList',
  putURL: '/api/otherresult',
  deleteURL: '/api/otherresults',
};
module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const CurrentModel = mysqlModel[routerBaseInfo.modelName_U];
  const { ajv } = opts;
  const routerMethod = new CommonMethod(CurrentModel);


  /**
   * 根据ID获取单个
   *
   * @param {*} request
   * @param {*} reply
   */
  const getById = async (request, reply) => {
    const runFun = async () => {
      const id = request.params.id;
      routerMethod.findOne(reply, id);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 获取所有
   *
   * @param {*} request
   * @param {*} reply
   */
  const getAll = async (request, reply) => {
    const runFun = async () => {
      const conditions = {};
      routerMethod.findAll(reply, conditions);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 根据条件获取列表
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const queryList = async (request, reply) => {
    const validate = ajv.compile(queryListSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const {
        current,
        pageSize,
        sorter,
        filter,
        ...where
      } = request.body;
      const include = {};
      routerMethod.queryList(reply, where, current, pageSize, sorter, filter, include);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 新增或更新
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const upsert = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(updateSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      await routerMethod.upsert(reply, request.body);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 批量删除
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const remove = async (request, reply) => {
    const validate = ajv.compile(deleteSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    const runFun = async () => {
      const ids = request.body.ids;
      await routerMethod.delete(reply, ids);
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

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
      { schema: { ...getByIdSchema, tags: ['otherresult'], summary: '根据ID获取单个' } },
      getById,
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['otherresult'], summary: '获取所有' } },
      getAll,
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['otherresult'], summary: '根据条件获取列表' } },
      queryList,
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['otherresult'], summary: '新增或更新' } },
      upsert,
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['otherresult'], summary: '批量删除' } },
      remove,
  );

  next();
});
