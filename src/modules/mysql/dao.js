/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-09 09:28:40
 * @LastEditors: zpl
 * @LastEditTime: 2020-11-04 18:36:43
 */
const { Op } = require('sequelize');

/**
 * 数据库操作统一成功应答
 *
 * @param {any} [data={}] 返回数据
 * @param {string} [message=''] 成功消息提示
 * @return {any}
 */
const onSuccess = (data = {}, message = '') => {
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
const onError = (message = '') => {
  return {
    status: 0,
    data: null,
    message,
  };
};


/**
 * 数据库操作类
 *
 * @class Dao
 */
class Dao {
  /**
   * Creates an instance of Dao.
   * @param {*} Model
   * @memberof Dao
   */
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * 查询所有
   *
   * @param {*} {
   *     order = [],
   *     attributes,
   *     include,
   *   }
   * @return {*}
   * @memberof Dao
   */
  async findAll({
    where = {},
    order = [],
    attributes,
    include,
  }) {
    const opt = {
      where,
      // TODO: 目前考虑兼容旧数据库表，后期应使用默认时间降序排序
      // order: order.concat([['createdAt', 'DESC']]),
      order,
    };
    if (include && Object.keys(include).length) {
      opt.include = include;
    }
    if (attributes) {
      opt.attributes = attributes;
    }

    const list = await this.Model.findAll(opt);
    if (list) {
      return onSuccess(list, '查询成功');
    }
    return onError('未查询到信息');
  }

  /**
   * 查询单个
   *
   * @param {*} [where={}]
   * @param {*} [include={}]
   * @return {*}
   */
  async findOne(where = {}, include={}) {
    const result = await this.Model.findOne({ where, include });
    if (result) {
      return onSuccess(result, '查询成功');
    }
    return onError('查询失败');
  }

  /**
   * 按条件查询
   *
   * @param {*} {
   *   where,
   *   order = [],
   *   pageSize = 20,
   *   current = 1,
   *   attributes,
   *   include,
   * }
   * @return {*}
   */
  async findSome({
    where,
    current = 1,
    pageSize = 20,
    order = [],
    attributes,
    include,
  }) {
    const opt = {
      where,
      // TODO: 目前考虑兼容旧数据库表，后期应使用默认时间降序排序
      // order: order.concat([['createdAt', 'DESC']]),
      order,
      offset: (current - 1) * pageSize,
      limit: pageSize,
    };
    if (include && Object.keys(include).length) {
      opt.include = include;
    }
    if (attributes) {
      opt.attributes = attributes;
    }
    const result = await this.Model.findAndCountAll(opt);

    if (result) {
      return onSuccess({
        total: result.count,
        list: result.rows,
      }, '查询成功');
    }
    return onError('未查询到信息');
  }

  /**
   * 创建
   *
   * @param {*} info
   * @param {*} [opt={}]
   * @return {*}
   * @memberof Dao
   */
  async create(info, opt={}) {
    const result = await this.Model.create(info, opt);
    if (result) {
      return onSuccess(result, '创建成功');
    } else {
      return onError('创建失败');
    }
  }

  /**
   * 单个更新
   *
   * @param {*} {
   *   id,
   *   updateInfo,
   * }
   * @return {*}
   */
  async updateOne({
    id,
    updateInfo,
  }) {
    const result = await this.Model.update({ ...updateInfo }, { where: { id } });
    if (result[0]) {
      return onSuccess(result[0], '更新成功');
    } else {
      return onError('更新失败');
    }
  }

  /**
   * 批量更新
   *
   * @param {*} {
   *   ids,
   *   updateInfo,
   * }
   * @return {*}
   */
  async updateMany({
    ids,
    updateInfo,
  }) {
    const result = await this.Model.update({ ...updateInfo }, {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (result[0]) {
      return onSuccess(result[0], '更新成功');
    } else {
      return onError('更新失败');
    }
  }

  /**
   * 新增或更新
   *
   * @param {*} values
   */
  async upsert(values) {
    const result = await this.Model.upsert(values);
    if (result[0]) {
      return onSuccess(result[0], '操作成功');
    }
    return onError('操作失败');
  }

  /**
   * 删除单个
   *
   * @param {*} id
   * @return {*}
   */
  async deleteOne(id) {
    const num = await this.Model.destroy({
      where: { id },
    });
    if (num) {
      return onSuccess({}, '删除成功');
    }
    return onError('删除失败');
  }

  /**
   * 删除多个
   *
   * @param {*} [ids=[]]
   * @return {*}
   */
  async deleteSome(ids = []) {
    const num = await this.Model.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (num) {
      return onSuccess(num, '删除成功');
    }
    return onError('删除失败');
  }
}

/**
 * 执行mysql事务
 *
 * @param {*} sequelize
 * @return {*}
 */
const transaction = (sequelize) => async (tran) => {
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

module.exports = {
  Dao,
  transaction,
};