/*
 * @description: 所有路由方法的抽象对象
 * @author: zpl
 * @Date: 2021-01-12 12:23:11
 * @LastEditTime: 2021-03-03 13:21:20
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const { onRouterSuccess, onRouterError } = require('../util');
/**
 * 数据库操作类
 *
 * @class DatabaseMethod
 */
class DatabaseMethod {
  /**
   * Creates an instance of DatabaseMethod.
   * @param {*} Model
   * @memberof DatabaseMethod
   */
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * 数据库操作统一成功应答
   *
   * @param {any} [data={}] 返回数据
   * @param {string} [message=''] 成功消息提示
   * @return {any}
   */
  onSuccess(data = {}, message = '') {
    return {
      status: 1,
      data,
      message,
    };
  };

  /**
   * 数据库操作统一错误应答
   *
   * @param {string} [message=''] 错误消息提示
   * @return {any}
   */
  onError(message = '') {
    return {
      status: 0,
      data: null,
      message,
    };
  };

  /**
   * 根据ID获取单个
   *
   * @param {*} id
   * @param {*} include
   * @return {*}
   * @memberof DatabaseMethod
   */
  async findById(id, include) {
    const opt = { where: { id } };
    if (include) {
      opt.include = include;
    }
    const result = await this.Model.findOne(opt);
    if (result) {
      return this.onSuccess(result, '查询成功');
    }
    return this.onError('查询失败');
  }

  /**
   * 根据其他条件获取单个
   *
   * @param {*} opt
   * @return {*}
   * @memberof DatabaseMethod
   */
  async findOne(opt) {
    const result = await this.Model.findOne(opt);
    if (result) {
      return this.onSuccess(result, '查询成功');
    }
    return this.onError('查询失败');
  }

  /**
   * 获取所有
   *
   * @param {*} [conditions={}]
   * @return {*}
   * @memberof DatabaseMethod
   */
  async findAll(conditions = {}) {
    const {
      where = {},
      sorter,
      attributes,
      include,
    } = conditions;

    const opt = {
      where,
      order: [],
    };

    // 组合排序条件
    if (sorter && Object.keys(sorter).length) {
      for (const key in sorter) {
        if (sorter.hasOwnProperty(key)) {
          const value = sorter[key].toLowerCase().includes('asc') ? 'ASC' : 'DESC';
          opt.order.push([key, value]);
        }
      }
    }
    const hasCreatedAt = this.Model.rawAttributes.hasOwnProperty('createdAt');
    if (hasCreatedAt) {
      opt.order = opt.order.concat([['createdAt', 'DESC']]);
    }

    if (attributes) {
      opt.attributes = attributes;
    }
    if (include && include.length) {
      opt.include = include;
    }

    const list = await this.Model.findAll(opt);
    if (list) {
      return this.onSuccess(list, '查询成功');
    }
    return this.onError('未查询到信息');
  }

  /**
   * 按条件查询
   *
   * @param {*} {
   *  where 查询条件,
   *  filter 过滤条件,
   *  sorter 排序条件,
   *  current 当前页数,
   *  pageSize 每页条数,
   *  attributes 查询列配置,
   *  include 关联查询条件,
   * }
   * @return {*}
   * @memberof DatabaseMethod
   */
  async queryList(
      {
        where = {},
        filter,
        sorter,
        current = 1,
        pageSize = 10,
        attributes,
        include,
      },
  ) {
    const conditions = {
      where: {},
      order: [],
    };
    if (pageSize !== -1) {
      conditions.offset = (current - 1) * pageSize;
      conditions.limit = pageSize;
    }

    // 组合查询条件
    if (where && Object.keys(where).length) {
      for (const key in where) {
        if (this.Model.rawAttributes.hasOwnProperty(key)) {
          const value = where[key];
          conditions.where[key] = typeof value === 'string' ? { [Op.like]: `%${value}%` } : value;
        }
      }
    }

    // 过滤条件
    if (filter && Object.keys(filter).length) {
      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          const value = filter[key];
          if (value) {
            conditions.where[key] = Array.isArray(value) ? { [Op.in]: value } : value;
          }
        }
      }
    }

    // 组合排序条件
    if (sorter && Object.keys(sorter).length) {
      for (const key in sorter) {
        if (sorter.hasOwnProperty(key)) {
          const value = sorter[key].toLowerCase().includes('asc') ? 'ASC' : 'DESC';
          conditions.order.push([key, value]);
        }
      }
    }
    const hasCreatedAt = this.Model.rawAttributes.hasOwnProperty('createdAt');
    if (hasCreatedAt) {
      conditions.order = conditions.order.concat([['createdAt', 'DESC']]);
    }

    // 字段设定
    if (attributes) {
      conditions.attributes = attributes;
    }

    // 关联查询
    if (include && include.length) {
      conditions.include = include;
    }
    const result = await this.Model.findAndCountAll(conditions);

    if (result) {
      return this.onSuccess({
        total: result.count,
        list: result.rows,
      }, '查询成功');
    }
    return this.onError('未查询到信息');
  }

  /**
   * 新增
   *
   * @param {*} info
   * @param {*} [opt={}]
   * @return {*}
   * @memberof DatabaseMethod
   */
  async create(info, opt = {}) {
    const result = await this.Model.create(info, opt);
    if (result) {
      return this.onSuccess(result, '创建成功');
    } else {
      return this.onError('创建失败');
    }
  }

  /**
   * 单个更新
   *
   * @param {*} id
   * @param {*} updateInfo
   * @return {*}
   * @memberof DatabaseMethod
   */
  async updateOne(id, updateInfo) {
    const current = await this.Model.findOne({ where: { id } });
    if (current) {
      for (const key in updateInfo) {
        if (Object.hasOwnProperty.call(updateInfo, key)) {
          const info = updateInfo[key];
          current[key] = info;
        }
      }
      current.save();
      return this.onSuccess(current, '更新成功');
    } else {
      return this.onError('无效id');
    }
  }

  /**
   * 批量更新
   *
   * @param {*} ids
   * @param {*} updateInfo
   * @return {*}
   * @memberof DatabaseMethod
   */
  async updateMany(ids, updateInfo) {
    const result = await this.Model.update({ ...updateInfo }, {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (result[0]) {
      return this.onSuccess(result[0], '更新成功');
    } else {
      return this.onError('更新失败');
    }
  }

  /**
   * 新增或更新
   *
   * @param {*} data
   * @return {*}
   * @memberof DatabaseMethod
   */
  async upsert(data) {
    const result = await this.Model.upsert(data);
    if (result[0]) {
      return this.onSuccess(result[0], '操作成功');
    }
    return this.onError('操作失败');
  }

  /**
   * 删除，接收id数组
   *
   * @param {*} [ids=[]]
   * @return {*}
   * @memberof DatabaseMethod
   */
  async delete(ids = []) {
    const num = await this.Model.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (num) {
      return this.onSuccess(num, '删除成功');
    }
    return this.onError('删除失败');
  }

  /**
   * 根据条件删除多个
   *
   * @param {*} [where={}]
   * @return {*}
   * @memberof DatabaseMethod
   */
  async deleteMany(where = {}) {
    const num = await this.Model.destroy({ where });
    if (num) {
      return this.onSuccess(num, '删除成功');
    }
    return this.onError('删除失败');
  }

  /**
   * 清空表
   *
   * @memberof DatabaseMethod
   */
  async destroy() {
    await this.Model.destroy({
      where: {},
    });
  }
}

/**
 * 所有路由方法的抽象对象
 *
 * @class CommonMethod
 */
class CommonMethod {
  /**
   * Creates an instance of CommonMethod.
   * @param {*} Model
   * @param {*} ajv
   * @memberof CommonMethod
   */
  constructor(Model, ajv) {
    this.dbMethod = new DatabaseMethod(Model);
    this.ajv = ajv;
  }

  /**
   * 公共参数验证方法，切片方法
   *
   * @param {*} schema 参数定义
   * @param {*} params 参数
   * @return {*} 传入下一步执行方法和对应的参数，验证结果会自动插入
   * @memberof CommonMethod
   */
  commonValidate(schema, params) {
    const validate = this.ajv.compile(schema.valueOf());
    const valid = validate(params);
    return (func, args = []) => {
      if (!valid) {
        args.push(valid.errors);
      }
      return func.call(this, ...args);
    };
  };

  /**
   * 统一响应
   *
   * @param {*} reply
   * @param {*} errors
   * @return {*} 核心执行方法，无错误信息时执行
   * @memberof CommonMethod
   */
  commonResponse(reply, errors) {
    return async (func) => {
      if (errors) {
        onRouterError(reply, { status: 200, message: errors });
      } else {
        const res = await func();
        const { status, data, message } = res;
        if (status) {
          onRouterSuccess(reply, data);
        } else {
          onRouterError(reply, { status: 200, message });
        }
      }
    };
  }

  /**
   * 统一执行方法
   * 以切片形式注入了参数验证和统一响应
   *
   * @param {*} request
   * @param {*} reply
   * @return {*} 最终返回async方法，调用时需要使用await，否则全局无法捕获到异常
   * @memberof CommonMethod
   */
  run(request, reply) {
    const { schema } = reply.context;
    return this.commonValidate(schema, request)(this.commonResponse, [reply]);
  }
}

/**
 * 表态类方法，执行mysql事务
 *
 * @param {*} sequelize
 * @return {Function}
 */
CommonMethod.transaction = (sequelize) => async (tran) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      return await tran(t);
    });
    // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
    return {
      status: 1,
      result,
    };
  } catch (error) {
    console.log('mysql事务执行失败，执行回滚...', error);
    return { status: 0 };
    // 如果执行到此,则发生错误.
    // 该事务已由 Sequelize 自动回滚！
  }
};

module.exports = CommonMethod;
