/*
 * @description: 报名列表统一查询方法
 * @author: zpl
 * @Date: 2020-08-02 15:03:30
 * @LastEditTime: 2020-08-02 15:52:10
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
  console.log('Into queryAll');
  const {TrainingReg, Training} = mysqlModel;

  const filter = search ? {[Op.or]: [
    {name: {[Op.substring]: search}},
    {mobile: {[Op.substring]: search}},
    {email: {[Op.substring]: search}},
    {comp: {[Op.substring]: search}},
  ]} : {};
  const queryOpt = {
    where: {
      ...filter,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['updatedAt', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const total = await TrainingReg.count({where: queryOpt.where});
  const list = await TrainingReg.findAll({
    ...queryOpt,
    include: {
      model: Training,
      attributes: ['id', 'title'],
    },
  });

  return {
    status: 'ok',
    total,
    list,
  };
};

const queryByTid = async ({
  mysqlModel,
  trainingId,
  search = '',
  orderName,
  orderValue,
  pageSize = 10,
  current = 1,
}) => {
  console.log('Into queryByTid');
  const {Training} = mysqlModel;

  const filter = search ? {[Op.or]: [
    {name: {[Op.substring]: search}},
    {mobile: {[Op.substring]: search}},
    {email: {[Op.substring]: search}},
    {comp: {[Op.substring]: search}},
  ]} : {};
  const queryOpt = {
    where: {
      ...filter,
    },
    order: [orderName ? [orderName, orderValue || 'DESC'] : ['updatedAt', 'DESC']],
    offset: (current - 1) * pageSize,
    limit: pageSize,
  };

  const training = await Training.findOne({
    where: {id: trainingId},
  });

  if (training) {
    const total = await training.countTrainingRegs({where: queryOpt.where});
    const list = await training.getTrainingRegs(queryOpt);
    return {
      status: 'ok',
      total,
      list,
    };
  }
  return {
    status: 'error',
    message: '无效的培训ID',
  };
};

exports.queryAll = queryAll;
exports.queryByTid = queryByTid;
