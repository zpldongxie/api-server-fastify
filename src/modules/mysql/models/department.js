/*
 * @description: 部门
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2021-03-04 11:16:40
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 部门
 *
 * @class Department
 * @extends {Model}
 */
class Department extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Department
   */
  static initNow(sequelize) {
    Department.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '名称',
      },
      tag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '分组英文标记，可用于前台判断身份',
      },
      desc: {
        type: DataTypes.STRING,
        comment: '描述',
      },
      orderIndex: {
        type: DataTypes.DOUBLE,
        comment: '排序值',
      },
      parentId: {
        type: DataTypes.UUID,
        comment: '父ID',
        references: {
          model: Department,
          key: 'id',
        },
      },
    }, {
      sequelize,
      modelName: 'Department',
      timestamps: false,
      comment: '部门',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Department
   */
  static reateAssociation(sequelize) {
    // 部门 - 用户， 多对多
    Department.belongsToMany(sequelize.models['User'], { through: 'DepartmentUser' });

    // 部门 - 权限， 一对多
    Department.hasMany(sequelize.models['Jurisdiction']);
  }
}

module.exports = Department;
