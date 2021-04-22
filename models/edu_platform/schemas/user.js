/*
 * @description: 用户表定义
 * @author: zpl
 * @Date: 2021-04-10 16:15:52
 * @LastEditTime: 2021-04-22 18:16:36
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'
import crypto from 'crypto'

const { DataTypes } = Sequelize

export default (XXDM, HMAC_KEY) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  loginName: { type: DataTypes.STRING(16), allowNull: false, unique: true, comment: '登录名，学号或工号' },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '密码',
    set(value) {
      this.setDataValue('password', crypto.createHmac('sha1', HMAC_KEY).update(value).digest('hex'));
    },
  },
  username: { type: DataTypes.STRING(60), allowNull: false, comment: '姓名' },
  avatar: { type: DataTypes.STRING, defaultValue: '', comment: '头像' },
  identityId: { type: DataTypes.STRING(36), comment: '身份ID' },
  departmentId: { type: DataTypes.STRING(36), comment: '部门ID' },
  status: { type: DataTypes.INTEGER, defaultValue: 0, comment: '状态，0无效1有效，其他可由业务自行定义' }
})

export const InfoSchema = S.object()
  .id('User')
  .description('用户')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('loginName', S.string().maxLength(16).description('登录名，学号或工号').required())
  .prop('password', S.string().maxLength(64).description('密码').required())
  .prop('username', S.string().maxLength(60).description('姓名').required())
  .prop('avatar', S.string().maxLength(200).default('').description('头像'))
  .prop('identityId', S.string().maxLength(36).default('').description('身份ID'))
  .prop('departmentId', S.string().maxLength(36).default('').description('部门ID'))
  .prop('status', S.number().description('状态，0无效1有效，其他可由业务自行定义').required())
  .prop(
    'userType',
    S.object()
      .prop('id', S.string().format('uuid').required())
      .prop('name', S.string().maxLength(20).required())
      .description('用户类型')
  )

export const publicSchema = S.object()
  .id('CurrentUser')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('loginName', S.string().maxLength(16).description('登录名，学号或工号').required())
  .prop('username', S.string().maxLength(60).description('姓名').required())
  .prop('avatar', S.string().maxLength(200).default('').description('头像'))
  .prop('identityId', S.string().maxLength(36).default('').description('身份ID'))
  .prop('departmentId', S.string().maxLength(36).default('').description('部门ID'))
  .prop('status', S.number().description('状态，0无效1有效，其他可由业务自行定义').required())
  .prop(
    'userType',
    S.object()
      .prop('id', S.string().format('uuid').required())
      .prop('name', S.string().maxLength(20).required())
      .description('用户类型')
  )
  .prop('csrfToken', S.string().description('csrf令牌').required())

export const CreateSchema = S.object()
  .id('CreateUser')
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('loginName', S.string().maxLength(16).description('登录名，学号或工号').required())
  .prop('password', S.string().maxLength(64).description('密码').required())
  .prop('username', S.string().maxLength(60).description('姓名').required())
  .prop('avatar', S.string().maxLength(200).default('').description('头像'))
  .prop('identityId', S.string().maxLength(36).default('').description('身份ID'))
  .prop('departmentId', S.string().maxLength(36).default('').description('部门ID'))
  .prop('status', S.number().description('状态，0无效1有效，其他可由业务自行定义').required())
  .prop(
    'userType',
    S.object()
      .prop('id', S.string().format('uuid'))
      .prop('name', S.string().maxLength(20).required())
      .description('用户类型')
    // .required()
  )
