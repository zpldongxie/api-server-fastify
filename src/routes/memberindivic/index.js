/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-12 17:28:36
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { memberStatus } = require('../../dictionary');
const { commonCatch, CommonMethod, onRouterError } = require('../util');
const { getCurrentDate } = require('../../util');

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
      const include = [{
        model: mysqlModel.MemberType,
        attributes: ['id', 'name'],
      }];
      routerMethod.findOne(reply, id, include);
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
      const include = [{
        model: mysqlModel.MemberType,
        attributes: ['id', 'name'],
      }];
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
      const { id, idNumber, mobile } = request.body;
      if (id) {
        // 编辑
        const idNumberRes = await routerMethod.dao.findAll({
          where: {
            id: { [Op.not]: id },
            idNumber, status: { [Op.not]: memberStatus.reject },
          },
        });
        if (idNumberRes.status && idNumberRes.data.length) {
          return onRouterError(reply, { status: 200, message: '证件号已经注册或正在申请' });
        }
        const mobileRes = await routerMethod.dao.findAll({
          where: {
            id: { [Op.not]: id },
            mobile, status: { [Op.not]: memberStatus.reject },
          },
        });
        if (mobileRes.status && mobileRes.data.length) {
          return onRouterError(reply, { status: 200, message: '手机号已经注册或正在申请' });
        }
        await routerMethod.updateOne(reply, id, request.body);
      } else {
        const res = await routerMethod.dao.findAll({
          where: {
            status: { [Op.not]: memberStatus.reject },
            [Op.or]: [{ idNumber }, { mobile }],
          },
        });
        if (res.status && res.data.length) {
          return onRouterError(reply, { status: 200, message: '证件号或手机号已经提交过申请，请不要重复提交' });
        }
        // 新增
        await routerMethod.create(reply, request.body);
      }
    };

    // 统一捕获异常
    commonCatch(runFun, reply)();
  };

  /**
   * 审核
   *
   * @param {*} request
   * @param {*} reply
   * @return {*}
   */
  const audit = async (request, reply) => {
    // 参数校验
    const validate = ajv.compile(auditSchema.body.valueOf());
    const valid = validate(request.body);
    if (!valid) {
      return reply.code(400).send(validate.errors);
    }

    // 执行方法
    const runFun = async () => {
      const { id, status } = request.body;
      const res = await routerMethod.dao.findOne({ id });
      if (!res.status) {
        return onRouterError(reply, { status: 200, message: 'ID错误，请确认后重新提交' });
      }
      let logonDate = null;
      if (res.data.status !== memberStatus.formalMember && status === memberStatus.formalMember) {
        logonDate = getCurrentDate();
      }
      await routerMethod.updateOne(reply, id, { ...request.body, logonDate });
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
      { schema: { ...getByIdSchema, tags: ['memberindivic'], summary: '根据ID获取单个个人会员' } },
      getById,
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['memberindivic'], summary: '获取所有个人会员' } },
      getAll,
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['memberindivic'], summary: '根据条件获取个人会员列表' } },
      queryList,
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['memberindivic'], summary: '新增或更新个人会员' } },
      upsert,
  );

  // 审核
  const auditSchema = require('./audit-schema');
  server.put(routerBaseInfo.auditURL,
      { schema: { ...auditSchema, tags: ['memberindivic'], summary: '审核' } },
      audit,
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['memberindivic'], summary: '批量删除个人会员' } },
      remove,
  );

  next();
});
