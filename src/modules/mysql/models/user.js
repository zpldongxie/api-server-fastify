/*
 * @description: 用户
 * @author: zpl
 * @Date: 2020-07-25 15:10:09
 * @LastEditTime: 2021-03-07 14:27:33
 * @LastEditors: zpl
 */
const crypto = require('crypto');
const config = require('config');
const { Model, DataTypes } = require('sequelize');

const { userStatus } = require('../../../dictionary');

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
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      loginName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '登录名',
      },
      password: {
        type: DataTypes.STRING(64),
        comment: '密码',
        set(value) {
          this.setDataValue('password', crypto.createHmac('sha1', config.get('hmacKey')).update(value).digest('hex'));
        },
      },
      mobile: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: '手机',
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '邮箱',
      },
      province: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '所属省份',
      },
      verificationCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '验证码',
      },
      logonDate: {
        type: DataTypes.DATE,
        comment: '注册时间',
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          userStatus.applying,
          userStatus.rejected,
          userStatus.enabled,
          userStatus.disabled,
        ],
        defaultValue: userStatus.applying,
        comment: '状态（申请中 | 申请驳回 | 启用 | 禁用）',
      },
    }, {
      sequelize,
      modelName: 'User',
      comment: '用户',
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
    // 用户 - 部门， 多对多
    User.belongsToMany(sequelize.models['Department'], { through: 'DepartmentUser' });

    // 用户 - 用户扩展， 一对多
    User.hasMany(sequelize.models['UserExtension']);

    // 用户 - 等级评定， 一对多
    User.hasMany(sequelize.models['Evaluation']);

    // 用户 - 评定申请， 一对多
    User.hasMany(sequelize.models['EvaluationRequest']);

    // 用户 - 发票信息， 一对一
    User.hasOne(sequelize.models['InvoiceInformation']);

    // 用户 - 质量管理体系， 一对多
    User.hasMany(sequelize.models['MSConstruction']);

    // 用户 - 自主开发产品， 一对多
    User.hasMany(sequelize.models['SelfProduct']);

    // 用户 - 安全服务工具， 一对多
    User.hasMany(sequelize.models['SafeTool']);

    // 用户 - 工作环境设施， 一对多
    User.hasMany(sequelize.models['WorkingEnvironment']);

    // 用户 - 服务渠道， 一对多
    User.hasMany(sequelize.models['ServiceChannel']);

    // 用户 - 等级评定审批， 一对多
    User.hasMany(sequelize.models['EvaluationApproval']);
  }
}

module.exports = User;
