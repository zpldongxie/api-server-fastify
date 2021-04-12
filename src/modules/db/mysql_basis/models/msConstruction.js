/*
 * @description: 管理体系建设情况
 * @author: zpl
 * @Date: 2021-02-24 15:09:58
 * @LastEditTime: 2021-02-25 13:16:55
 * @LastEditors: zpl
 */

const { Model, DataTypes } = require('sequelize');

/**
 * 管理体系建设情况
 *
 * @class MSConstruction
 * @extends {Model}
 */
class MSConstruction extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof MSConstruction
   */
  static initNow(sequelize) {
    MSConstruction.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      systemName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '体系名称',
      },
      buildingProgress: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['完整', '部分', '未建设'],
        comment: '建设情况',
      },
      isItCertified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '是否获证',
      },
      issuingAgency: {
        type: DataTypes.STRING(50),
        comment: '发证机构',
      },
    }, {
      sequelize,
      modelName: 'MSConstruction',
      timestamps: false,
      comment: '管理体系建设情况',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof MSConstruction
   */
  static reateAssociation(sequelize) {
    // 管理体系建设情况 - 用户， 多对一
    MSConstruction.belongsTo(sequelize.models['User']);

    // 管理体系建设情况 - 等级评定申请， 多对一
    MSConstruction.belongsTo(sequelize.models['EvaluationRequest']);
  }
}

module.exports = MSConstruction;
