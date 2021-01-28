/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-01-28 10:20:04
 * @LastEditors: zpl
 */
const { Op, col } = require('sequelize');
const CommonMethod = require('../commonMethod');

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
          const include = [{
            model: ChannelSettingModule,
            on: {
              channel_id: {
                [Op.eq]: col('Channel.id'),
              },
            },
            attributes: {
              exclude: ['ChannelId'],
            },
          }];
          const res = await that.dbMethod.findById(id, include);
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
          const { config: { ChannelSettingModule } } = reply.context;
          const where = {};
          const order = [['orderIndex', 'DESC']];
          const include = [{
            model: ChannelSettingModule,
            on: {
              channel_id: {
                [Op.eq]: col('Channel.id'),
              },
            },
            attributes: {
              exclude: ['ChannelId'],
            },
            // attributes: ['id', 'title', 'descStr', 'pic', 'video', 'link', 'type'],
          }];
          const res = await that.dbMethod.findAll({ where, order, include });
          return res;
        },
    );
  }

  /**
   * 关键字过滤查找栏目
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getOnFilter(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { filter } = request.params;
          const where = filter ? { keyWord: { [Op.substring]: filter } } : {};
          const order = [['orderIndex', 'DESC']];
          const attributes = ['id', 'name', 'keyWord'];
          const res = await that.dbMethod.findAll({ where, order, attributes });
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
          const { config: { ChannelSettingModule } } = reply.context;
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [{
            model: ChannelSettingModule,
            on: {
              channel_id: {
                [Op.eq]: col('Channel.id'),
              },
            },
            attributes: {
              exclude: ['ChannelId'],
            },
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
   * 新增或更新
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async upsert(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const res = await that.dbMethod.upsert(request.body);
          return res;
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
