/*
 * @description:通用工具
 * @author: zpl
 * @Date: 2020-07-28 19:22:01
 * @LastEditTime: 2020-09-12 15:28:41
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const { Dao, transaction } = require('../modules/mysql/dao');

/**
 * 统一正常响应处理
 *
 * @param {*} reply
 * @param {*} [data=null]
 * @param {string} [msg='请求成功']
 * @param {string} [code=200]
 */
const onRouterSuccess = (reply, data = null, msg = '请求成功', code = 200) => {
  reply.code(code).send({
    status: 'ok',
    data,
    msg,
  });
};

/**
 * 统一异常响应处理
 *
 * @param {*} reply
 * @param {*} err
 */
const onRouteError = (reply, err) => {
  console.log('====================================');
  console.debug(err);
  console.log('====================================');
  const code = err.status || 500;
  const message = code === 500 ?
    'Internal Server Error' :
    err.message;
  const resBody = {
    status: 'error',
    message,
  };
  reply.code(code).send(resBody);
};

/**
 * 执行方法前统一捕获异常进行处理
 *
 * @param {*} method
 * @param {*} reply
 * @return {*}
 */
const commonCatch = (method, reply) => {
  return async (...args) => {
    try {
      await method(...args);
    } catch (error) {
      console.log('进入异常分支');
      console.debug(error);
      let err = error;
      switch (error.message) {
        case 'Validation error':
          // 数据库验证错误
          err = {
            status: 422,
            message: error.errors[0].message,
          };
          break;
      }
      onRouteError(reply, err);
    }
  };
};

/**
 * 路由公共方法
 *
 * @class CommonMethod
 */
class CommonMethod {
  /**
   * Creates an instance of CommonMethod.
   * @param {*} Model
   * @memberof CommonMethod
   */
  constructor(Model) {
    this.dao = new Dao(Model);
  }

  /**
   * 根据ID获取单个
   *
   * @param {*} reply
   * @param {*} id
   */
  async findOne(reply, id) {
    const result = await this.dao.findOne({ id });
    if (result.status) {
      onRouterSuccess(reply, result.data);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 获取所有
   *
   * @param {*} reply
   * @param {*} [conditions={}] 查询条件
   */
  async findAll(reply, conditions = {}) {
    const result = await this.dao.findAll(conditions);
    if (result.status) {
      onRouterSuccess(reply, result.data);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 按条件查询
   *
   * @param {*} reply
   * @param {*} where 查询条件
   * @param {*} current 当前页数
   * @param {*} pageSize 每页条数
   * @param {*} sorter 排序条件
   * @param {*} filter 过滤条件
   * @param {*} include 关联查询条件
   */
  async queryList(reply, where, current, pageSize, sorter, filter, include) {
    const conditions = {
      where: {},
      current,
      pageSize,
      order: [],
      include,
    };

    // 组合排序条件
    if (sorter && Object.keys(sorter).length) {
      for (const key in sorter) {
        if (sorter.hasOwnProperty(key)) {
          const value = sorter[key].includes('asc') ? 'ASC' : 'DESC';
          conditions.order.push([key, value]);
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

    // 组合查询条件
    if (where && Object.keys(where).length) {
      for (const key in where) {
        if (this.dao.Model.rawAttributes.hasOwnProperty(key)) {
          const value = where[key];
          conditions.where[key] = value;
        }
      }
    }

    const result = await this.dao.findSome(conditions);
    if (result.status) {
      onRouterSuccess(reply, result.data);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 新增
   *
   * @param {*} reply
   * @param {*} data 数据
   */
  async create(reply, data) {
    const result = await this.dao.create(data);
    if (result.status) {
      onRouterSuccess(reply, result.data, '创建成功', 201);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 更新
   *
   * @param {*} reply
   * @param {*} id
   * @param {*} data 数据
   */
  async updateOne(reply, id, data) {
    const result = await this.dao.updateOne({ id, updateInfo: data });
    if (result.status) {
      onRouterSuccess(reply, result.data, '更新成功', 201);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 批量更新单个属性
   *
   * @param {*} reply
   * @param {*} ids
   * @param {*} updateInfo
   */
  async updateMany(reply, ids, updateInfo) {
    const result = await this.dao.updateMany({ ids, updateInfo });
    if (result.status) {
      onRouterSuccess(reply, result.data, '更新成功', 201);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 新增或更新
   *
   * @param {*} reply
   * @param {*} data
   * @memberof CommonMethod
   */
  async upsert(reply, data) {
    const result = await this.dao.upsert(data);
    if (result.status) {
      onRouterSuccess(reply, result.data, 201);
    } else {
      onRouteError(reply, result.message);
    }
  }

  /**
   * 删除，接收id数组
   *
   * @param {*} reply
   * @param {*} ids
   * @memberof CommonMethod
   */
  async delete(reply, ids) {
    const result = await this.dao.deleteSome(ids);
    if (result.status) {
      onRouterSuccess(reply, result.data, 204);
    } else {
      onRouteError(reply, result.message);
    }
  }
}

module.exports = {
  onRouterSuccess,
  onRouteError,
  commonCatch,
  CommonMethod,
  transaction,
};
