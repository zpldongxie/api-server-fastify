/*
 * @description: 用户表
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2021-04-13 14:52:53
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import user from './schemas/user.js'

const { Model } = Sequelize;

class User extends Model {
  getFullName() {
    return `${this.nombre} ${this.apellidos}`;
  }
  static associate(models) {
    //No asociations
  }
  static getId(where) {
    return this.findOne({
      where,
      attributes: ["id"],
      order: [["createdAt", "DESC"]]
    });
  }

  static getById(id) {
    return this.findOne({ where: { id } })
  }

  /**
   * 验证用户名密码
   *
   * @static
   * @param {*} username
   * @param {*} password
   * @return {*} 
   * @memberof User
   */
  static getUsernameAndPassword(username, password) {
    return this.findOne({
      where: {
        username: username,
        password: password
      }
    });
  }

  /**
   * 模型初始化
   *
   * @static
   * @param {*} sequelize
   * @param {*} DataTypes
   * @return {*} 
   * @memberof User
   */
  static init(sequelize) {
    return super.init(user, {
      tableName: "usuarios",
      sequelize,
      comment: '用户',
    })
  }
  toJSON() {
    return {
      username: this.username,
      apellidos: this.apellidos,
      email: this.email,
      nombre: this.nombre,
      createdAt: this.createdAt.toDateString()
    }
  }

  /**
   * Definition of class atributes outside constructor, because we dont want to call the constructor
   * @private
   */
  _constructor() {
    /** @public Nombre de usuario @type {string} */
    this.username = "";
    /** @public Identificador de usuario en la BB.DD @type {number} */
    this.id = 1;
    /** @public Email del usuario @type {string} */
    this.email = "";
    /** @public Password del usuario @type {string} */
    this.password = "";
    /** @public Nombre de la persona @type {string} */
    this.nombre = "";
    /** @public Apellidos de la persona @type {string} */
    this.apellidos = "";
    /** @public Fecha de creación @type {Date} */
    this.createdAt = new Date();
    /** @public Fecha de actualización @type {Date} */
    this.updatedAt = new Date();

  }
}

export default User;