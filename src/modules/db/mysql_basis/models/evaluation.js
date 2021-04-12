/*
 * @description: 等级评定
 * @author: zpl
 * @Date: 2020-07-26 14:30:44
 * @LastEditTime: 2021-02-24 17:04:16
 * @LastEditors: zpl
 */
const { Model, DataTypes } = require('sequelize');

/**
 * 等级评定
 *
 * @class Evaluation
 * @extends {Model}
 */
class Evaluation extends Model {
  /**
   * 初始化，统一暴露给index，保证所有model使用同一sequelize实例
   *
   * @static
   * @param {*} sequelize
   * @memberof Evaluation
   */
  static initNow(sequelize) {
    Evaluation.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      level: {
        type: DataTypes.STRING(4),
        allowNull: false,
        comment: '评定级别',
      },
      regDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '评定生效时间',
      },
      periodOfValidity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: '有效期',
      },
      status: {
        type: DataTypes.ENUM,
        values: ['生效', '撤销'],
        defaultValue: '生效',
        comment: '状态（生效 | 撤销）',
      },
      expired: {
        type: DataTypes.VIRTUAL,
        get() {
          const regDate = new Date(this.regDate);
          const expiredDate = regDate.setFullYear(regDate.getFullYear() + this.periodOfValidity);
          return new Date() > expiredDate;
        },
        set(value) {
          // do nothing
        },
        comment: '虚拟字段，是否过期',
      },
      remark: {
        type: DataTypes.STRING(),
        defaultValue: '',
        comment: '备注',
      },
    }, {
      sequelize,
      modelName: 'Evaluation',
      timestamps: false,
      comment: '等级评定',
    });
  }

  /**
   * 与其他表创建关联
   *
   * @static
   * @param {*} sequelize
   * @memberof Evaluation
   */
  static reateAssociation(sequelize) {
    // 等级评定 - 用户， 多对一
    Evaluation.belongsTo(sequelize.models['User']);

    // 等级评定 - 服务类别， 多对一
    Evaluation.belongsTo(sequelize.models['ServiceType']);

    // 等级评定 - 证书颁发， 一对一
    Evaluation.belongsTo(sequelize.models['CertificateIssuing']);
  }
}

module.exports = Evaluation;
