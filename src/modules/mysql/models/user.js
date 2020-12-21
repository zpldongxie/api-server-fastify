/*
 * @description: 用户
 * @author: zpl
 * @Date: 2020-12-18 11:52:48
 * @LastEditTime: 2020-12-21 10:12:51
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');
const { userLevel } = require('../../../dictionary');

/**
 * 用户
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof User
   */
  static initNow(sequelize) {
    User.init({
      num: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        comment: '人员代码',
      },
      pwd: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(16),
        is: /^[0-9a-f]{16}$/i,
        defaultValue: 'xafy1234',
        comment: '密码',
      },
      name: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '姓名',
      },
      sex: {
        type: DataTypes.STRING,
        values: ['男', '女'],
        comment: '性别',
      },
      level: { // 用户级别,0：管理员，1：领导，2：普通用户，普通用户才有后面的信息
        type: DataTypes.INTEGER,
        values: [userLevel.admin, userLevel.leader, userLevel.user],
        defaultValue: userLevel.user,
        comment: '用户级别',
      },
      college: {
        type: DataTypes.STRING,
        comment: '学院，所在单位',
      },
      political_outlook: {
        type: DataTypes.STRING,
        comment: '政治面貌',
      },
      birthday: {
        type: DataTypes.DATE,
        comment: '出生年月',
      },
      native_place: {
        type: DataTypes.STRING,
        comment: '籍贯',
      },
      signing_time: {
        type: DataTypes.DATE,
        comment: '签约时间',
      },
      enter_date: {
        type: DataTypes.DATE,
        comment: '入校时间',
      },
      enter_level: {
        type: DataTypes.STRING,
        comment: '入校层次',
      },
      title: {
        type: DataTypes.STRING,
        comment: '职称',
      },
      review_time: {
        type: DataTypes.DATE,
        comment: '评审时间',
      },
      Dr_school: {
        type: DataTypes.STRING,
        comment: '博士毕业学校',
      },
      Dr_major: {
        type: DataTypes.STRING,
        comment: '博士专业',
      },
      graduation_date: {
        type: DataTypes.DATE,
        comment: '毕业时间',
      },
      Dr_tutor_name: {
        type: DataTypes.STRING,
        comment: '博导姓名',
      },
      Dr_tutor_title: {
        type: DataTypes.STRING,
        comment: '博导称号',
      },
      overseas: {
        type: DataTypes.STRING,
        comment: '海外经历',
      },
      overseas_time: {
        type: DataTypes.STRING,
        comment: '经历时限',
      },
      overseas_Dr: {
        type: DataTypes.STRING,
        comment: '海外博士',
      },
      after_Dr: {
        type: DataTypes.STRING,
        comment: '博后经历',
      },
      status: {
        type: DataTypes.STRING,
        comment: '人员状态',
      },
      mobile: {
        type: DataTypes.STRING,
        comment: '联系方式',
      },
      remark: {
        type: DataTypes.STRING,
        comment: '备注',
      },
    }, {
      sequelize,
      comment: '用户表',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof User
   */
  static reateAssociation(sequelize) {
    // 待遇
    User.hasOne(sequelize.models['TmtTarget']);
    User.hasMany(sequelize.models['TmtResult']);
    // 论文
    User.hasOne(sequelize.models['ThesisTarget']);
    User.hasOne(sequelize.models['ThesisResult']);
    // 项目
    User.hasOne(sequelize.models['ProjectTarget']);
    User.hasOne(sequelize.models['ProjectResult']);
    // 其他
    User.hasOne(sequelize.models['OtherTarget']);
    User.hasOne(sequelize.models['OtherResult']);
  }
}

module.exports = User;
