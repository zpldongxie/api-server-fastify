/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-15 18:08:15
 * @LastEditors: zpl
 */
const CommonMethod = require('../commonMethod');
const DepTagMethod = require('../deptag/method');

/**
 * 路由用到的方法
 *
 * @class Method
 * @extends {CommonMethod}
 */
class Method extends CommonMethod {
  /**
   * Creates an instance of Method.
   * @param {*} mysql
   * @param {*} modelName
   * @param {*} ajv
   * @memberof Method
   */
  constructor(mysql, modelName, ajv) {
    super(mysql[modelName], ajv);
    this.mysql = mysql;
    this.model = mysql[modelName];
    this.depTagMethod = new DepTagMethod(mysql, 'DepTag', ajv);
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
          const res = await that.dbMethod.findAll();
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
   * @param {*} opt
   * @memberof Method
   */
  async create(opt) {
    const include = [];
    await this.dbMethod.deleteMany({
      DepTagId: opt.DepTagId,
      ModularId: opt.ModularId,
    });
    const res = await this.dbMethod.create(opt, { include });
    return res;
  }

  /**
   * 更新
   *
   * @param {*} opt
   * @memberof Method
   */
  async update(opt) {
    const { id, ...info } = opt;
    const res = await this.dbMethod.updateOne(id, info);
    return res;
  }

  /**
   * 新增或更新
   *
   * @param {*} opt
   * @memberof Method
   */
  async upsert(opt) {
    const { id } = opt;
    if (id) {
      return await this.update(opt);
    } else {
      return await this.create(opt);
    }
  }

  /**
   * 设置可读权限
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setRead(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { body: { id, depTag, modularId, canRead } } = request;
          const opt = { id, ModularId: modularId, canRead };
          if (!canRead) {
            opt.canWrite = false;
          }
          const depTagRes = await that.depTagMethod.dbMethod.findOne({ where: { name: depTag } });
          if (depTagRes) {
            opt.DepTagId = depTagRes.data.id;
            return await this.upsert(opt);
          } else {
            return {
              status: 0,
              message: '部门类型无效',
            };
          }
        },
    );
  }

  /**
   * 设置可写权限
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setWrite(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { body: { id, depTag, modularId, canWrite } } = request;
          const opt = { id, ModularId: modularId, canWrite };
          // TODO: 可以考虑优化，当父级为false，所有子级也为false，任一子级为true，父级也为true
          if (canWrite) {
            opt.canRead = true;
          }
          const depTagRes = await that.depTagMethod.dbMethod.findOne({ where: { name: depTag } });
          if (depTagRes) {
            opt.DepTagId = depTagRes.data.id;
            return await this.upsert(opt);
          } else {
            return {
              status: 0,
              message: '部门类型无效',
            };
          }
        },
    );
  }

  /**
   * 批量删除
   *
   * @param {*} ids
   * @return {*}
   * @memberof Method
   */
  async remove(ids) {
    const res = await this.dbMethod.delete(ids);
    return res;
  }
}

module.exports = Method;
