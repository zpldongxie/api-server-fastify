/*
 * @description: 安全培训报名
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-07-26 23:34:58
 * @LastEditors: zpl
 */
const {Model, DataTypes} = require('sequelize');

/**
   * 安全培训报名
   *
   * @class TrainingReg
   * @extends {Model}
   */
class TrainingReg extends Model {}

exports.TrainingReg = TrainingReg;

module.exports = (sequelize) => {
  TrainingReg.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '姓名',
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '手机',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '邮箱',
    },
    comp: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '公司',
    },
    registTime: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      comment: '报名时间',
    },
    signInTime: {
      type: DataTypes.DATEONLY,
      comment: '签到时间',
    },
  }, {
    sequelize,
    modelName: 'TrainingReg',
    tableName: 'training_reg',
    indexes: [{unique: true, fields: ['mobile']}],
  });

  // TrainingReg.sync({match: new RegExp('^' + sequelize.getDatabaseName() + '$')});

  return TrainingReg;
};
