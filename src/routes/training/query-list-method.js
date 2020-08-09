/*
 * @description: 文章列表统一查询方法
 * @author: zpl
 * @Date: 2020-07-30 14:49:39
 * @LastEditTime: 2020-08-06 22:59:45
 * @LastEditors: zpl
 */
const {Op} = require('sequelize');
const queryAll = async ({
  mysqlModel,
  search = '',
  orderName,
  orderValue,
  pageSize = 10,
  current = 1,
}) => {
  const {Training, Channel} = mysqlModel;

  const filter = search ? {title: {[Op.substring]: search}} : {};
  const queryOpt = {
    where: {
      ...filter,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['updatedAt', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const total = await Training.count({where: queryOpt.where});
  const list = await Training.findAll({
    ...queryOpt,
    include: {
      model: Channel,
      attributes: ['id', 'name'],
    },
  });

  return {
    status: 'ok',
    total,
    list,
  };
};

const queryByCid = async ({
  mysqlModel,
  channelId,
  search = '',
  orderName,
  orderValue,
  pageSize = 10,
  current = 1,
}) => {
  const {Channel} = mysqlModel;

  const filter = search ? {title: {[Op.substring]: search}} : {};
  const queryOpt = {
    where: {
      ...filter,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['createdAt', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const channel = await Channel.findOne({
    where: {id: channelId},
  });

  if (channel) {
    const total = await channel.countTrainings({where: queryOpt.where});
    const list = await channel.getTrainings(queryOpt);
    return {
      status: 'ok',
      total,
      list,
    };
  }
  return {
    status: 'error',
    message: '无效的栏目ID',
  };
};

exports.queryAll = queryAll;
exports.queryByCid = queryByCid;
