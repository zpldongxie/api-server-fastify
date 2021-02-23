/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-02-23 16:05:30
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');

const { entryStatus } = require('../../dictionary');

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
          console.log('entry getAll begin');
          const { config: { ChannelModel } } = reply.context;
          const res = await that.dbMethod.findAll({
            include: [{
              model: ChannelModel,
              attributes: ['id', 'name', 'enName'],
            }],
          });
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
          console.log('entry queryList begin');
          const { config: { ChannelModel } } = reply.context;
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [{
            model: ChannelModel,
            attributes: ['id', 'name', 'enName'],
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
          console.log('entry create begin');
          const { config: { ChannelModel, channelDBMethod } } = reply.context;
          const { Channels, ...info } = request.body;
          const cIds = Channels.map((channel) => channel.id);
          const oldRes = await that.dbMethod.queryList({
            where: {
              corporateName: info.corporateName,
              status: { [Op.in]: [entryStatus.applying, entryStatus.firstPass, entryStatus.alreadyEntry] },
            },
            include: [{
              model: ChannelModel,
              where: { id: { [Op.in]: cIds } },
            }],
          });
          if (!oldRes.status || !oldRes.data.total) {
            const { status, data } = await channelDBMethod.queryList({ where: { id: { [Op.in]: cIds } } });
            if (status) {
              const channels = data.list;
              const res = await that.dbMethod.create(info);
              if (res.status) {
                const current = res.data;
                current.setChannels(channels);
                return {
                  status: 1,
                  data: current,
                };
              } else {
                return {
                  status: 0,
                  message: res.message,
                };
              }
            } else {
              return {
                status: 0,
                message: '指定栏目不存在',
              };
            }
          } else {
            return {
              status: 0,
              message: '系统检测到已有相同或重复申请流程，请不要提交重复内容。',
            };
          }
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
          console.log('entry create begin');
          const { config: { ChannelModel, channelDBMethod } } = reply.context;
          const { id, Channels, ...info } = request.body;
          const cIds = Channels.map((channel) => channel.id);
          const oldRes = await that.dbMethod.queryList({
            where: {
              id: { [Op.not]: id },
              corporateName: info.corporateName,
              status: { [Op.in]: [entryStatus.applying, entryStatus.firstPass, entryStatus.alreadyEntry] },
            },
            include: [{
              model: ChannelModel,
              where: { id: { [Op.in]: cIds } },
            }],
          });
          if (!oldRes.status || !oldRes.data.total) {
            const { status, data } = await channelDBMethod.queryList({ where: { id: { [Op.in]: cIds } } });
            if (status) {
              const res = await that.dbMethod.updateOne(id, info);
              if (res.status) {
                const current = res.data;
                await current.setChannels(data.list);
                return {
                  status: 1,
                  data: current,
                };
              } else {
                return {
                  status: 0,
                  message: res.message,
                };
              }
            } else {
              return {
                status: 0,
                message: '指定栏目不存在',
              };
            }
          } else {
            return {
              status: 0,
              message: '不能修改为已有相同申请流程',
            };
          }
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
      await that.update(request, reply);
    } else {
      await that.create(request, reply);
    }
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
