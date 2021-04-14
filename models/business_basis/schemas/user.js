/*
 * @description: 用户表定义
 * @author: zpl
 * @Date: 2021-04-10 16:15:52
 * @LastEditTime: 2021-04-13 19:27:42
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING, defaultValue: "" },
  apellidos: { type: DataTypes.STRING, defaultValue: "" },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}

export const InfoSchema = S.object()
  .id('User')
  .description('用户')

export const publicSchema = S.object()
  .id('CurrentUser')
  .prop('email', S.string().description('邮箱').required())
  .prop('username', S.string().description('用户名').required())
  .prop('nombre', S.string().description('名').required())
  .prop('apellidos', S.string().description('姓').required())
  .prop('createdAt', S.string().description('创建时间').required());

export const privateSchema = S.object()
  .id('UpdateUserInfo')
  .prop('id', S.number())
  .prop('email', S.string().description('邮箱').required())
  .prop('username', S.string().description('用户名').required())
  .prop('password', S.string().description('密码').required())
  .prop('nombre', S.string().description('名'))
  .prop('apellidos', S.string().description('姓'))
  .prop('createdAt', S.string().description('创建时间'))
  .prop('updatedAt', S.string().description('修改时间'));