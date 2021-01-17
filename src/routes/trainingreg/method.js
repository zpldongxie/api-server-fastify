/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-01-17 20:06:20
 * @LastEditors: zpl
 */
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
          const { config: { TrainingModule } } = reply.context;
          const id = request.params.id;
          const include = [{
            model: TrainingModule,
            attributes: ['id', 'title'],
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
          const { config: { TrainingModule } } = reply.context;
          const include = [{
            model: TrainingModule,
            attributes: ['id', 'title'],
          }];
          const res = await that.dbMethod.findAll({ include });
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
          if (!sorter.hasOwnProperty('createdAt')) {
            sorter.createdAt = 'desc';
          }
          const include = [{
            model: TrainingModule,
            attributes: ['id', 'title'],
            include: {
              model: ChannelModule,
              attributes: ['id', 'name'],
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
          // const { config: { TrainingModel } } = reply.context;
          const { TrainingId, mobile, ...info } = request.body;
          const trRes = that.dbMethod.findOne({ where: { TrainingId, mobile } });
          if (trRes.status) {
            return {
              status: 0,
              message: '该手机号已经提交过申请，请不要重复提交',
            };
          }
          // const include = [{
          //   model: TrainingModel,
          // }];
          const res = await that.dbMethod.create({ ...info, TrainingId, mobile });
          return res;
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
          const { id, TrainingId, mobile, ...info } = request.body;
          const trRes = that.dbMethod.findOne({
            where: {
              TrainingId, mobile,
              id: { [Op.not]: id },
            },
          });
          if (trRes.status) {
            return {
              status: 0,
              message: '该手机号已经提交过申请',
            };
          }
          const res = await that.dbMethod.updateOne(id, { ...info, TrainingId, mobile });
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

  /**
   * 设置审批状态
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setPassed(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { ids, passed } = request.body;
          const res = await that.dbMethod.updateMany(ids, { passed });
          return res;
        },
    );
  }
}

module.exports = Method;
