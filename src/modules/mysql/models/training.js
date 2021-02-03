/* eslint-disable new-cap */
/*
 * @description: 安全培训
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-01 10:09:59
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

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
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        comment: '培训标题',
      },
      subTitle: {
        type: DataTypes.STRING(64),
        defaultValue: '',
        comment: '培训副标题',
      },
      registStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '报名开始时间',
      },
      registEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '报名截止时间',
      },
      trainingMethod: {
        type: DataTypes.STRING(20),
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
        defaultValue: '',
        comment: '培训介绍',
      },
    }, {
      sequelize,
      modelName: 'Training',
      comment: '安全培训',
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
    // 培训 - 栏目， 多对一
    Training.belongsTo(sequelize.models['Channel']);
    // 培训 - 培训报名， 一对多
    Training.hasMany(sequelize.models['TrainingReg'], { onDelete: 'CASCADE' });
  }
}

module.exports = Training;
