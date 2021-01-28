/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-01-27 19:00:12
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');
const { serviceStatus } = require('../../dictionary');

const { acceptTemplate, rejectTemplate, inServiceTemplate, finishedTemplate } = require('./email-template');

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
          const id = request.params.id;
          const res = await that.dbMethod.findById(id);
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
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [];
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
          const info = request.body;
          const { contactsMobile, demandType } = info;
          const res = await that.dbMethod.findAll({
            where: { contactsMobile, demandType, status: { [Op.not]: serviceStatus.finished } },
          });
          if (res.status && res.data.length) {
            return {
              status: 0,
              message: '该手机号已存在同类型未完成的服务申请，请不要重复提交',
            };
          }
          const createRes = await that.dbMethod.create(info);
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
          const { id, contactsMobile, demandType, ...info } = request.body;
          const res = await that.dbMethod.findAll({
            where: { id: { [Op.not]: id }, contactsMobile, demandType, status: { [Op.not]: serviceStatus.finished } },
          });
          if (res.status && res.data.length) {
            return {
              status: 0,
              message: '该手机号已存在同类型未完成的服务申请',
            };
          }
          const updateRes = await that.dbMethod.updateOne(id, { ...info, contactsMobile, demandType });
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
      that.create(request, reply);
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
          const { id, ...props } = request.body;
          const res = await that.dbMethod.findById(id);
          if (!res.status) {
            return {
              status: 0,
              message: 'ID错误，请确认后重新提交',
            };
          }
          const updateRes = await that.dbMethod.updateOne(id, props);
          if (updateRes.status) {
            const currentRes = await that.dbMethod.findById(id);
            const from = await sysConfigModel.findOne({ where: { name: 'from', group: '邮箱' } });
            const current = currentRes.data;
            let html = '';
            switch (status) {
              case serviceStatus.accept:
              // 接受申请
                html = acceptTemplate;
                break;
              case serviceStatus.reject:
              // 拒绝申请
                html = rejectTemplate;
                break;
              case serviceStatus.inService:
              // 服务中
                html = inServiceTemplate;
                break;
              case serviceStatus.finished:
              // 服务完成
                html = finishedTemplate;
                break;
            }
            html = html.replace('%name%', current.corporateName);
            const { createdAt } = current;
            html = html.replace(
                '%createdAt%',
                `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日`,
            );
            html = html.replace('%demandType%', current.demandType);
            const now = new Date(getCurrentDate());
            html = html.replace('%date%', `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`);
            html = html.replace('%rejectDesc%', current.rejectDesc);
            html = getEmailHtml(html);
            if (html !== '') {
              try {
                await nodemailer.sendMail({
                  from: from.value,
                  to: current.email,
                  subject: '陕西省信息网络安全协会服务申请回执',
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
