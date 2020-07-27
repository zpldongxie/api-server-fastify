/*
 * @description: mySql
 * @author: zpl
 * @Date: 2020-07-25 14:47:25
 * @LastEditTime: 2020-07-27 13:59:15
 * @LastEditors: zpl
 */

const fp = require('fastify-plugin');
const {Sequelize} = require('sequelize');

module.exports = fp(async (fastify, opts, next) => {
  const {host, database, user, password, dialect, pool} = opts;
  const sequelize = new Sequelize(database, user, password, {
    host,
    dialect,
    pool,
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // 用户
    const UserModel = require('./models/user')(sequelize);
    // 用户组
    const UserGroupModel = require('./models/userGroup')(sequelize);
    // const UserGroupUserModel = require('./models/user_group_user')(sequelize);
    // 栏目
    const ChannelModel = require('./models/channel')(sequelize);
    // 培训
    const TrainingModel = require('./models/training')(sequelize);
    // 培训报名
    const TrainingRegModel = require('./models/training-registration')(sequelize);

    // 表关联
    // 用户 - 用户组
    UserModel.belongsToMany(UserGroupModel, {
      through: 'user-group-user',
      as: 'groups',
      foreignKey: 'user_id',
    });
    UserGroupModel.belongsToMany(UserModel, {
      through: 'user-group-user',
      as: 'users',
      foreignKey: 'user_group_id',
    });
    // 栏目 - 培训
    ChannelModel.hasMany(TrainingModel);
    TrainingModel.belongsTo(ChannelModel);
    // 培训 - 培训报名
    TrainingModel.hasMany(TrainingRegModel);
    TrainingRegModel.belongsTo(TrainingModel);

    // 处理未创建表的情况
    UserModel.sync({match: new RegExp('^' + database + '$')});
    UserGroupModel.sync({match: new RegExp('^' + database + '$')});
    sequelize.models['user-group-user'].sync({match: new RegExp('^' + database + '$')});
    ChannelModel.sync({match: new RegExp('^' + database + '$')});
    TrainingModel.sync({match: new RegExp('^' + database + '$')});
    TrainingRegModel.sync({match: new RegExp('^' + database + '$')});

    const models = {
      UserModel,
      UserGroupModel,
      ChannelModel,
      TrainingModel,
      TrainingRegModel,
    };

    fastify.decorate('mysql', {models});
    const initResult = await require('./init-data')(models);
    console.log('数据库初始化执行结果：');
    console.log(initResult);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  next();
});
