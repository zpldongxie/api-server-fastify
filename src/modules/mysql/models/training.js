/*
 * @description: 安全培训
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-07-30 00:19:36
 * @LastEditors: zpl
 */
const {Model, DataTypes} = require('sequelize');

/**
   * 安全培训
   *
   * @class Training
   * @extends {Model}
   */
class Training extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Training
   */
  static initNow(sequelize) {
    Training.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '培训标题',
      },
      subTitle: {
        type: DataTypes.STRING,
        comment: '培训副标题',
      },
      registStartTime: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '报名开始时间',
      },
      registEndTime: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '报名截止时间',
      },
      trainingMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '培训方式',
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '培训开始时间',
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '培训结束时间',
      },
      desc: {
        type: DataTypes.STRING,
        comment: '培训介绍',
      },
    }, {
      sequelize,
      modelName: 'Training',
      tableName: 'training',
      indexes: [{unique: true, fields: ['title']}],
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Training
   */
  static reateAssociation(sequelize) {
    // 栏目 - 培训， 一对多
    Training.belongsTo(sequelize.models['Channel']);
    // 培训 - 培训报名， 一对多
    Training.hasMany(sequelize.models['TrainingReg']);
  }
}

module.exports = Training;
