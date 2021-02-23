/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-02-23 16:19:24
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
   * 显示状态过滤查找栏目
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getByShowStatus(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          console.log('channel getByShowStatus begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const { showStatus } = request.params;
          const where = showStatus ? { showStatus: { [Op.in]: showStatus.split(',') } } : {};
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
   * 类型名称过滤查找栏目
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getByTypeName(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          console.log('channel getByTypeName begin');
          const { config: { ChannelTypeModule, ChannelSettingModule } } = reply.context;
          const { typeName } = request.params;
          const where = {};
          const order = [['orderIndex', 'DESC']];
          const include = [{
            model: ChannelTypeModule,
            where: typeName ? { name: { [Op.in]: typeName.split(',') } } : {},
          }, {
            model: ChannelSettingModule,
          }];
          const res = await that.dbMethod.findAll({ where, order, include });
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
          const { parentId = null, ...info } = request.body;
          const childrenRes = await that.dbMethod.queryList({
            where: {
              parentId,
            },
            sorter: { orderIndex: 'DESC' },
            current: 1,
            pageSize: 1,
          });
          const orderIndex = (childrenRes.status && childrenRes.data.list[0]) ?
                              Math.round(childrenRes.data.list[0].orderIndex + 10) :
                              0;
          const createRes = await that.dbMethod.create({ parentId, ...info, orderIndex });
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
          const { id, parentId = null, ...info } = request.body;
          const currentRes = await that.dbMethod.findById(id);
          if (currentRes.status) {
            const newInfo = { parentId, ...info };
            const current = currentRes.data;
            // 跨栏目移动时需要重新计算排序值
            if (parentId !== current.parentId) {
              const childrenRes = await that.dbMethod.queryList({
                where: {
                  id: { [Op.not]: id },
                  parentId,
                },
                sorter: { orderIndex: 'DESC' },
                current: 1,
                pageSize: 1,
              });
              newInfo.orderIndex = (childrenRes.status && childrenRes.data.list[0]) ?
                                  Math.round(childrenRes.data.list[0].orderIndex + 10) :
                                  0;
            }
            const updateRes = await that.dbMethod.updateOne(id, newInfo);
            return updateRes;
          } else {
            return {
              status: 0,
              message: '无效的栏目ID',
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
   * 设置栏目配置继承状态
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setSettingExtend(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          console.log('channel setSettingExtend begin');
          const { id, settingExtend } = request.body;
          const res = await that.dbMethod.updateOne(id, { settingExtend });
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
          const { id, afterId, sorterMode } = request.body;
          // 被排序记录
          const currentRes = await that.dbMethod.findById(id);
          // 在谁后面
          const afterRes = await that.dbMethod.findById(afterId);
          if (currentRes.status && afterRes.status) {
            const current = currentRes.data;
            const after = afterRes.data;

            // 前后两条记录的排序值
            let startOrderIndex = after.orderIndex;
            let endOrderIndex;
            if (sorterMode === '嵌套模式') {
              // 嵌套移动
              current.parentId = after.id;

              // 查找相邻记录的排序值
              const childrenRes = await that.dbMethod.queryList({
                where: {
                  parentId: after.id,
                  id: { [Op.not]: current.id },
                  orderIndex: { [Op.gt]: after.orderIndex },
                },
                sorter: { orderIndex: 'DESC' },
                current: 1,
                pageSize: 1,
              });
              startOrderIndex = (childrenRes.status && childrenRes.data.list[0]) ?
                                  childrenRes.data.list[0].orderIndex :
                                  -10;
              endOrderIndex = null;

              // await current.save();
              // console.log('已经移动到指定目录');
            } else {
              // 嵌套移动
              if (current.parentId !== after.parentId) {
                current.parentId = after.parentId;
                // await current.save();
                // console.log('已经移动到相同目录');
              }

              // 查找相邻记录的排序值
              const nextRes = await that.dbMethod.queryList({
                where: {
                  parentId: after.parentId,
                  id: { [Op.not]: current.id },
                  orderIndex: { [Op.gt]: after.orderIndex },
                },
                sorter: { orderIndex: 'ASC' },
                current: 1,
                pageSize: 1,
              });
              endOrderIndex = (nextRes.status && nextRes.data.list[0]) ? nextRes.data.list[0].orderIndex : null;
            }

            // 计算新的排序值
            const newIndex = getInsertOrderIndex(startOrderIndex, endOrderIndex);
            if (newIndex !== null) {
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
