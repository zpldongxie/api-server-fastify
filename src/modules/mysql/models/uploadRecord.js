/*
 * @description: 上传记录表
 * @author: zpl
 * @Date: 2021-03-17 09:41:55
 * @LastEditTime: 2021-03-17 09:45:25
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 上传记录
 *
 * @class UploadRecord
 * @extends {Model}
 */
class UploadRecord extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof UploadRecord
   */
  static initNow(sequelize) {
    UploadRecord.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(32),
        allowNull: false,
        comment: '标题',
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '路径',
      },
      remark: {
        type: DataTypes.STRING(100),
        comment: '备注',
      },
    }, {
      sequelize,
      modelName: 'UploadRecord',
      comment: '上传记录',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof UploadRecord
   */
  static reateAssociation(sequelize) {
    // 上传记录 - 等级评定申请表， 多对一
    UploadRecord.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = UploadRecord;
