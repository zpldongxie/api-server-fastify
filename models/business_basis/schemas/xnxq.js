/*
 * @description: 学年学期
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-13 19:27:50
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  XN: { type: DataTypes.STRING(10), allowNull: false, comment: '学年' },
  XQ: { type: DataTypes.STRING(10), allowNull: false, comment: '学期' },
  KSRQ: { type: DataTypes.STRING(8), allowNull: false, comment: '开始日期' },
  JSRQ: { type: DataTypes.STRING(8), allowNull: false, comment: '结束日期' },
}

export const InfoSchema = S.object()
  .id('XNXQ')
  .description('学年学期')
  .prop('id', S.string().format('uuid').required())
  .prop('XN', S.string().maxLength(10).description('学年').required())
  .prop('XQ', S.string().maxLength(10).description('学期').required())
  .prop('KSRQ', S.string().maxLength(8).description('开始日期').required())
  .prop('JSRQ', S.string().maxLength(8).description('结束日期').required())

export const CreateSchema = S.object()
  .id('CreateXNXQ')
  .description('创建学年学期')
  .prop('XN', S.string().maxLength(10).description('学年').required())
  .prop('XQ', S.string().maxLength(10).description('学期').required())
  .prop('KSRQ', S.string().maxLength(8).description('开始日期').required())
  .prop('JSRQ', S.string().maxLength(8).description('结束日期').required())