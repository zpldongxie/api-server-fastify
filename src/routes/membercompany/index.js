/*
 * @description: 路由
 * @author: zpl
 * @Date: 2020-08-02 13:19:12
 * @LastEditTime: 2021-01-12 10:57:18
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const { Op } = require('sequelize');
const { commonCatch, CommonMethod, onRouterError } = require('../util');
const { memberStatus } = require('../../dictionary');
const { getCurrentDate } = require('../../util');

const routerBaseInfo = {
  modelName_U: 'MemberCompany',
  modelName_L: 'membercompany',
  getURL: '/api/membercompany/:id',
  getAllURL: '/api/membercompanys',
  getListURL: '/api/getMemberCompanyList',
  putURL: '/api/membercompany',
  auditURL: '/api/membercompany/audit',
  deleteURL: '/api/membercompanys',
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
      routerMethod.findOne(reply, parseInt(id), include);
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
      const { id, corporateName } = request.body;
      if (id) {
        // 编辑
        const res = await routerMethod.dao.findAll({
          where: {
            corporateName, id: { [Op.not]: id },
            status: { [Op.not]: memberStatus.reject },
          },
        });
        if (res.status && res.data.length) {
          return onRouterError(reply, { status: 200, message: '该公司名称已经注册或正在申请' });
        }
        await routerMethod.updateOne(reply, id, request.body);
      } else {
        const res = await routerMethod.dao.findAll({
          where: {
            corporateName,
            status: { [Op.not]: memberStatus.reject },
          },
        });
        if (res.status && res.data.length) {
          return onRouterError(reply, { status: 200, message: '该公司已经提交过申请，请不要重复提交' });
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
      { schema: { ...getByIdSchema, tags: ['membercompany'], summary: '根据ID获取单个企业会员' } },
      getById,
  );

  // 获取所有
  server.get(
      routerBaseInfo.getAllURL,
      { schema: { tags: ['membercompany'], summary: '获取所有企业会员' } },
      getAll,
  );

  // 根据条件获取列表
  const queryListSchema = require('./query-list-schema');
  server.post(
      routerBaseInfo.getListURL,
      { schema: { ...queryListSchema, tags: ['membercompany'], summary: '根据条件获取企业会员列表' } },
      queryList,
  );

  // 新增或更新
  const updateSchema = require('./update-schema');
  server.put(routerBaseInfo.putURL,
      { schema: { ...updateSchema, tags: ['membercompany'], summary: '新增或更新企业会员' } },
      upsert,
  );

  // 审核
  const auditSchema = require('./audit-schema');
  server.put(routerBaseInfo.auditURL,
      { schema: { ...auditSchema, tags: ['membercompany'], summary: '审核' } },
      audit,
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      routerBaseInfo.deleteURL,
      { schema: { ...deleteSchema, tags: ['membercompany'], summary: '批量删除企业会员' } },
      remove,
  );

  next();
});
