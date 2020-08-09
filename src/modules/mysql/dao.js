/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-09 09:28:40
 * @LastEditors: zpl
 * @LastEditTime: 2020-08-09 16:06:15
 */
const { Op } = require('sequelize');

/**
 * 统一成功应答
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
 * 统一错误应答
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
 * 执行方法前统一捕获异常进行处理
 *
 * @param {any} method
 * @return {any}
 */
const doSomething = (method) => {
  try {
    return method;
  } catch (error) {
    return onError('系统异常');
  }
};

/**
 * 查询所有
 *
 * @param {any} Model
 * @return {any}
 */
const findAll = (Model) => async ({
  order = [],
  attributes,
  include,
}) => {
  const list = await Model.findAll({
    order: order.concat([['createdAt', 'DESC']]),
    attributes,
    include,
  });

  return onSuccess({
    list,
  }, '查询成功');
};

/**
 * 查询单个
 *
 * @param {any} Model
 * @return {any}
 */
const findOne = (Model) => async (where = {}) => {
  const result = await Model.findOne({ where });
  if (result) {
    return onSuccess(result, '查询成功');
  }
  return onError('查询失败');
};

/**
 * 按条件查询
 *
 * @param {any} Model
 * @return {any}
 */
const findSome = (Model) => async ({
  where,
  order = [],
  pageSize = 20,
  current = 1,
  attributes,
  include,
}) => {
  const total = await Model.count({ where });
  const list = await Model.findAll({
    where,
    order: order.concat([['createdAt', 'DESC']]),
    offset: (current - 1) * pageSize,
    limit: pageSize,
    attributes,
    include,
  });

  return onSuccess({
    total,
    list,
  }, '查询成功');
};

/**
 * 创建
 *
 * @param {any} Model
 * @return {any}
 */
const create = (Model) => async (info) => {
  const model = await Model.create(info);
  return onSuccess(model, '创建成功');
};

/**
 * 更新
 *
 * @param {any} Model
 * @return {any}
 */
const updateOne = (Model) => async ({
  id,
  updateInfo,
}) => {
  await Model.update({ ...updateInfo }, { where: { id } });
  return onSuccess({}, '更新成功');
};

/**
 * 更新
 *
 * @param {any} Model
 * @return {any}
 */
const updateMany = (Model) => async ({
  ids,
  updateInfo,
}) => {
  await Model.update({ ...updateInfo }, {
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  return onSuccess({}, '更新成功');
};

/**
 * 删除单个
 *
 * @param {any} Model
 * @return {any}
 */
const deleteOne = (Model) => async (id) => {
  await Model.destroy({
    where: { id },
  });
  return onSuccess({}, '删除成功');
};

/**
 * 删除多个
 *
 * @param {any} Model
 * @return {any}
 */
const deleteSome = (Model) => async (ids = []) => {
  await Model.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  return onSuccess({}, '删除成功');
};

module.exports = {
  findAll: doSomething(findAll),
  findOne: doSomething(findOne),
  findSome: doSomething(findSome),
  create: doSomething(create),
  updateOne: doSomething(updateOne),
  updateMany: doSomething(updateMany),
  deleteOne: doSomething(deleteOne),
  deleteSome: doSomething(deleteSome),
};
