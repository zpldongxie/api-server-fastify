/*
 * @description: 用户表定义
 * @author: zpl
 * @Date: 2021-04-10 16:15:52
 * @LastEditTime: 2021-04-10 16:19:07
 * @LastEditors: zpl
 */
export const loadSchema = function(DataTypes){
  return {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      nombre: { type: DataTypes.STRING, defaultValue: "" },
      apellidos: { type: DataTypes.STRING, defaultValue: "" },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }
};
export const publicSchema = {
      email: { type: 'string'},
      username: { type: 'string'},
      nombre: { type: 'string'},
      apellidos: { type: 'string'},
      createdAt: { type: 'string'}
};
export const privateSchema = {
  id: { type: 'number'},
  email: { type: 'string'},
  username: { type: 'string'},
  password: { type: 'string'},
  nombre: { type: 'string'},
  apellidos: { type: 'string'},
  createdAt: { type: 'string'},
  updatedAt: { type: 'string'},
};