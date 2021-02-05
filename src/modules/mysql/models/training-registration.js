/* eslint-disable new-cap */
/*
 * @description: 安全培训报名
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2021-02-03 16:33:49
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
   * 安全培训报名
   *
   * @class TrainingReg
   * @extends {Model}
   */
class TrainingReg extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof TrainingReg
   */
  static initNow(sequelize) {
    TrainingReg.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '姓名',
      },
      mobile: {
        type: DataTypes.STRING(11),
        allowNull: false,
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
      passed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否审核通过',
      },
      sendEmailStatus: {
        type: DataTypes.STRING(25),
        defaultValue: '未发送',
        comment: '邮件发送状态，未发送|发送失败|发送成功时间',
      },
      signInTime: {
        type: DataTypes.DATE,
        comment: '签到时间',
      },
      // '报名时间'就是创建时间
    }, {
      sequelize,
      modelName: 'TrainingReg',
      comment: '安全培训报名',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof TrainingReg
   */
  static reateAssociation(sequelize) {
    // 培训报名 - 培训， 多对一
    TrainingReg.belongsTo(sequelize.models['Training']);
  }
}

module.exports = TrainingReg;
