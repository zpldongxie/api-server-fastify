/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-01-27 18:00:20
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');
const { memberStatus } = require('../../dictionary');
const { getCurrentDate, getEmailHtml } = require('../../util');

const { firstResoveTemplate, rejectTemplate, formalMemberTemplate, disableTemplate } = require('./email-template');

/**
 * 路由用到的方法
 *
 * @class Method
 * @extends {CommonMethod}
 */
class Method extends CommonMethod {
  /**
   * Creates an instance of Method.
   * @param {*} Model
   * @param {*} ajv
   * @memberof Method
   */
  constructor(Model, ajv) {
    super(Model, ajv);
  }

  /**
   * 根据ID获取单个
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getById(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            config: {
              MemberTypeModel,
            },
          } = reply.context;
          const id = request.params.id;
          const include = [{
            model: MemberTypeModel,
            attributes: ['id', 'name'],
          }];
          const res = await that.dbMethod.findById(parseInt(id), include);
          return res;
        },
    );
  }

  /**
   * 获取所有
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getAll(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const res = await that.dbMethod.findAll(request.params);
          return res;
        },
    );
  }

  /**
   * 根据条件获取列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async queryList(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { config: { MemberTypeModel } } = reply.context;
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [{
            model: MemberTypeModel,
            attributes: ['id', 'name'],
          }];
          const res = await that.dbMethod.queryList({
            where,
            filter,
            sorter,
            current,
            pageSize,
            attributes,
            include,
          });
          return res;
        },
    );
  }

  /**
   * 新增
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async create(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { config: { MemberTypeModel } } = reply.context;
          const { corporateName } = request.body;
          const res = await that.dbMethod.findAll({
            where: {
              corporateName,
              status: { [Op.not]: memberStatus.reject },
            },
          });
          if (res.status && res.data.length) {
            return {
              status: 0,
              message: '该公司已经提交过申请，请不要重复提交',
            };
          }
          const include = [{
            model: MemberTypeModel,
            attributes: ['id', 'name'],
          }];
          const createRes = await that.dbMethod.create(request.body, { include });
          return createRes;
        },
    );
  }

  /**
   * 更新
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async update(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { id, corporateName, ...info } = request.body;
          const res = await that.dbMethod.findAll({
            where: {
              corporateName, id: { [Op.not]: id },
              status: { [Op.not]: memberStatus.reject },
            },
          });
          if (res.status && res.data.length) {
            return {
              status: 0,
              message: '该公司名称已经注册或正在申请',
            };
          }
          const updateRes = await that.dbMethod.updateOne(id, { ...info, corporateName });
          return updateRes;
        },
    );
  }

  /**
   * 新增或更新
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async upsert(request, reply) {
    const that = this;
    const { id } = request.body;
    if (id) {
      that.update(request, reply);
    } else {
      this.create(request, reply);
    }
  }

  /**
   * 审核
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async audit(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { config: { sysConfigModel, nodemailer } } = reply.context;
          const { id, status } = request.body;
          const res = await that.dbMethod.findById(id);
          if (!res.status) {
            return {
              status: 0,
              message: 'ID错误，请确认后重新提交',
            };
          }
          let logonDate = null;
          if (res.data.status !== memberStatus.formalMember && status === memberStatus.formalMember) {
            logonDate = getCurrentDate();
          }
          const updateRes = await that.dbMethod.updateOne(id, { ...request.body, logonDate });
          if (updateRes.status) {
            const currentRes = await that.dbMethod.findById(id);
            const from = await sysConfigModel.findOne({ where: { name: 'from', group: '邮箱' } });
            const current = currentRes.data;
            let html = '';
            switch (status) {
              case memberStatus.firstPass:
                // 初审通过
                html = firstResoveTemplate;
                break;
              case memberStatus.reject:
                // 审核不通过
                html = rejectTemplate;
                break;
              case memberStatus.formalMember:
                // 成为正式会员
                html = formalMemberTemplate;
                break;
              case memberStatus.disable:
                // 禁用
                html = disableTemplate;
                break;
            }
            html = html.replace('%name%', current.corporateName);
            const now = new Date(getCurrentDate());
            html = html.replace('%date%', `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`);
            html = html.replace('%rejectDesc%', current.rejectDesc);
            html = getEmailHtml(html);
            if (html !== '') {
              try {
                await nodemailer.sendMail({
                  from: from.value,
                  to: current.email,
                  subject: '陕西省信息网络安全协会单位会员状态变更提醒',
                  html,
                });
                const sendEmailStatus = getCurrentDate();
                await that.dbMethod.updateOne(id, { sendEmailStatus });
              } catch (e) {
                await that.dbMethod.updateOne(id, { sendEmailStatus: '发送失败' });
                return {
                  status: 0,
                  message: '邮件发送失败',
                };
              }
            }
          }
          return updateRes;
        },
    );
  }

  /**
   * 批量删除
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async remove(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const ids = request.body.ids;
          const res = await that.dbMethod.delete(ids);
          return res;
        },
    );
  }
}

module.exports = Method;
