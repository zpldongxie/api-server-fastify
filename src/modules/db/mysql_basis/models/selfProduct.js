/*
 * @description: 自主开发产品
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-25 14:25:34
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 自主开发产品
 *
 * @class SelfProduct
 * @extends {Model}
 */
class SelfProduct extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof SelfProduct
   */
  static initNow(sequelize) {
    SelfProduct.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '产品名称',
      },
      descStr: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '产品概述',
      },
      features: {
        type: DataTypes.STRING(50),
        defaultValue: false,
        comment: '功能特点',
      },
      certificationStatus: {
        type: DataTypes.STRING(50),
        comment: '认证情况',
      },
    }, {
      sequelize,
      modelName: 'SelfProduct',
      timestamps: false,
      comment: '自主开发产品',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof SelfProduct
   */
  static reateAssociation(sequelize) {
    // 自主开发产品 - 用户， 多对一
    SelfProduct.belongsTo(sequelize.models['User']);

    // 自主开发产品 - 等级评定申请， 多对一
    SelfProduct.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = SelfProduct;
