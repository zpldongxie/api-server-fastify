/*
 * @description: 用户
 * @author: zpl
 * @Date: 2020-07-25 15:10:09
 * @LastEditTime: 2020-07-30 00:21:14
 * @LastEditors: zpl
 */
const {Model, DataTypes} = require('sequelize');

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
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      loginName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
      },
      name: {
        // eslint-disable-next-line new-cap
        type: DataTypes.STRING(64),
        comment: '姓名',
        allowNull: false,
      },
      sex: {
        type: DataTypes.STRING,
        comment: '性别',
        values: ['男', '女'],
      },
      mobile: {
        type: DataTypes.STRING,
        comment: '手机',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '邮箱',
      },
      remark: {
        type: DataTypes.STRING,
        comment: '备注',
      },
      verification_code: {
        type: DataTypes.STRING,
        comment: '验证码',
      },
      status: {
        type: DataTypes.INTEGER,
        comment: '状态,1为启用，0为未启用',
      },
      // TODO: 等完全从java后台切换过来后，这两个属性要移除
      last_edit_time: {
        type: DataTypes.STRING,
      },
      create_time: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'user',
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
    // 用户 - 用户组， 多对多
    User.belongsToMany(sequelize.models['UserGroup'], {
      through: 'user-group-user',
      foreignKey: 'user_id',
    });
  }
}

module.exports = User;
// exports.User = User;
// module.exports = (sequelize) => {
//   User.init({
//     id: {
//       type: DataTypes.BIGINT,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     loginName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       // eslint-disable-next-line new-cap
//       type: DataTypes.STRING(64),
//       is: /^[0-9a-f]{64}$/i,
//     },
//     name: {
//       // eslint-disable-next-line new-cap
//       type: DataTypes.STRING(64),
//       comment: '姓名',
//       allowNull: false,
//     },
//     sex: {
//       type: DataTypes.STRING,
//       comment: '性别',
//       values: ['男', '女'],
//     },
//     mobile: {
//       type: DataTypes.STRING,
//       comment: '手机',
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: '邮箱',
//     },
//     remark: {
//       type: DataTypes.STRING,
//       comment: '备注',
//     },
//     verification_code: {
//       type: DataTypes.STRING,
//       comment: '验证码',
//     },
//     status: {
//       type: DataTypes.INTEGER,
//       comment: '状态,1为启用，0为未启用',
//     },
//     // TODO: 等完全从java后台切换过来后，这两个属性要移除
//     last_edit_time: {
//       type: DataTypes.STRING,
//     },
//     create_time: {
//       type: DataTypes.STRING,
//     },
//   }, {
//     sequelize,
//     modelName: 'User',
//     tableName: 'user',
//   });

//   return User;
// };
