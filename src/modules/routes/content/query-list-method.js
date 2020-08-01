/*
 * @description: 文章列表统一查询方法
 * @author: zpl
 * @Date: 2020-07-30 14:49:39
 * @LastEditTime: 2020-07-30 15:40:37
 * @LastEditors: zpl
 */
const queryAll = async ({
  mysqlModel,
  search = {},
  orderName,
  orderValue,
  pageSize = 10,
  current = 1,
}) => {
  const {ContentDetail, Channel} = mysqlModel;

  const queryOpt = {
    attributes: {exclude: ['mainCon']},
    where: {
      ...search,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['create_time', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const total = await ContentDetail.count({where: queryOpt.where});
  const list = await ContentDetail.findAll({
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
  search = {},
  orderName,
  orderValue,
  pageSize = 10,
  current = 1,
}) => {
  const {Channel} = mysqlModel;

  const queryOpt = {
    attributes: {exclude: ['mainCon']},
    where: {
      ...search,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['create_time', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const channel = await Channel.findOne({
    where: {id: channelId},
  });

  if (channel) {
    const total = await channel.countContentDetails({where: queryOpt.where});
    const list = await channel.getContentDetails(queryOpt);
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
