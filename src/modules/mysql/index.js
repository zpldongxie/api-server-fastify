/*
 * @description: mySql
 * @author: zpl
 * @Date: 2020-07-25 14:47:25
 * @LastEditTime: 2020-07-29 13:49:55
 * @LastEditors: zpl
 */

const fp = require('fastify-plugin');
const {Sequelize} = require('sequelize');

module.exports = fp(async (fastify, opts, next) => {
  const {host, database, user, password, dialect, pool, needCreatTable} = opts;
  const sequelize = new Sequelize(database, user, password, {
    host,
    dialect,
    pool,
    operatorsAliases: false, // 仍可通过传入 operators map 至 operatorsAliases 的方式来使用字符串运算符，但会返回弃用警告
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // 用户
    const UserModel = require('./models/user');
    UserModel.initNow(sequelize);
    // 用户组
    const UserGroupModel = require('./models/userGroup');
    UserGroupModel.initNow(sequelize);
    // 栏目
    const ChannelModel = require('./models/channel');
    ChannelModel.initNow(sequelize);
    // 文章
    const ContentDetailModel = require('./models/content-detail');
    ContentDetailModel.initNow(sequelize);
    // 栏目配置
    const ChannelSettingModel = require('./models/channel-setting');
    ChannelSettingModel.initNow(sequelize);
    // 培训
    const TrainingModel = require('./models/training');
    TrainingModel.initNow(sequelize);
    // 培训报名
    const TrainingRegModel = require('./models/training-registration');
    TrainingRegModel.initNow(sequelize);

    // 表关联
    // 用户 - 用户组
    UserModel.belongsToMany(UserGroupModel, {
      through: 'user-group-user',
      foreignKey: 'user_id',
    });
    UserGroupModel.belongsToMany(UserModel, {
      through: 'user-group-user',
      foreignKey: 'user_group_id',
    });
    // 栏目 - 文章
    ChannelModel.belongsToMany(ContentDetailModel, {
      through: 'content_detail_channel',
      as: 'contents',
      foreignKey: 'channel_id',
    });
    ContentDetailModel.belongsToMany(ChannelModel, {
      through: 'content_detail_channel',
      as: 'channels',
      foreignKey: 'content_detail_id',
    });
    // 栏目 - 栏目配置
    ChannelModel.hasMany(ChannelSettingModel);
    ChannelSettingModel.belongsTo(ChannelModel, {foreignKey: {name: 'channel_id'}});
    // 栏目 - 培训
    ChannelModel.hasMany(TrainingModel);
    TrainingModel.belongsTo(ChannelModel);
    // 培训 - 培训报名
    TrainingModel.hasMany(TrainingRegModel);
    TrainingRegModel.belongsTo(TrainingModel);

    const initResult = await require('./init-data')(sequelize.models, needCreatTable, database);
    console.log('数据库初始化执行结果：');
    console.log(initResult);
    fastify.decorate('mysql', {models: sequelize.models});
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  next();
});
