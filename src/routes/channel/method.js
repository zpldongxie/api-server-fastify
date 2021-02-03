/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-02-03 14:34:59
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');

const { getInsertOrderIndex } = require('../../util');

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
          console.log('channel getById begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const id = request.params.id;
          const include = [{
            model: ChannelTypeModule,
          }, {
            model: ChannelSettingModule,
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
          console.log('channel getAll begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const where = {};
          const order = [['orderIndex', 'DESC']];
          const include = [{
            model: ChannelTypeModule,
          }, {
            model: ChannelSettingModule,
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
          console.log('channel getOnFilter begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const { filter } = request.params;
          const where = filter ? { keyWord: { [Op.substring]: filter } } : {};
          const order = [['orderIndex', 'DESC']];
          const attributes = ['id', 'name', 'keyWord'];
          const include = [{
            model: ChannelTypeModule,
          }, {
            model: ChannelSettingModule,
          }];
          const res = await that.dbMethod.findAll({ where, order, attributes, include });
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
          console.log('channel queryList begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [{
            model: ChannelTypeModule,
          }, {
            model: ChannelSettingModule,
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
   * 设置显示状态
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setShowStatus(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          console.log('channel setShowStatus begin');
          const { id, showStatus } = request.body;
          const res = await that.dbMethod.updateOne(id, { showStatus });
          return res;
        },
    );
  }

  /**
   * 移动栏目
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async move(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          console.log('channel move begin');
          const { id, afterId } = request.body;
          // 被排序记录
          const currentRes = await that.dbMethod.findById(id);
          // 在谁后面
          const afterRes = await that.dbMethod.findById(afterId);
          if (currentRes.status && afterRes.status) {
            const current = currentRes.data;
            const after = afterRes.data;
            // 在谁前面
            const nextRes = await that.dbMethod.queryList({
              where: {
                parentId: after.parentId,
                id: { [Op.not]: current.id },
                orderIndex: { [Op.gt]: after.orderIndex },
              },
              sorter: { orderIndex: 'ASC' },
              current: 1,
              pageSize: 2,
            });
            // 移动
            if (current.parentId !== after.parentId) {
              current.parentId = after.parentId;
              await current.save();
              console.log('已经移动到相同目录');
            }
            // 排序
            const startOrderIndex = after.orderIndex;
            const endOrderIndex = (nextRes.status && nextRes.data.list[0]) ? nextRes.data.list[0].orderIndex : null;
            const newIndex = getInsertOrderIndex(startOrderIndex, endOrderIndex);
            if (newIndex) {
              current.orderIndex = newIndex;
              await current.save();
              return {
                status: 1,
              };
            } else {
              return {
                status: 0,
                message: '序号有误，无法完成排序',
              };
            }
          } else {
            return {
              status: 0,
              message: '未查找到栏目信息，无法执行移动',
            };
          }
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
          console.log('channel remove begin');
          const ids = request.body.ids;
          const res = await that.dbMethod.delete(ids);
          return res;
        },
    );
  }
}

module.exports = Method;
