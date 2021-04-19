/*
 * @description: 作息方案
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-17 19:33:02
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  FAMC: {	type: DataTypes.STRING(10), allowNull: false, comment: '方案名称' },
  KSRQ: {	type: DataTypes.STRING(8), allowNull: false, comment: '开始日期' },
  JSRQ: {	type: DataTypes.STRING(8), allowNull: false, comment: '结束日期' },
  QSSJ: {	type: DataTypes.STRING(6), allowNull: false, comment: '起始时间' },
  SM: {	type: DataTypes.STRING(64), comment: '说明' },
})

export const InfoSchema = S.object()
  .id('ZXFA')
  .description('作息方案')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('FAMC', S.string().maxLength(10).description('方案名称').required())
  .prop('KSRQ', S.string().maxLength(8).description('开始日期').required())
  .prop('JSRQ', S.string().maxLength(8).description('结束日期').required())
  .prop('QSSJ', S.string().maxLength(6).description('起始时间').required())
  .prop('SM', S.string().maxLength(64).description('说明'))

export const CreateSchema = S.object()
  .id('CreateZXFA')
  .description('创建作息方案')
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('FAMC', S.string().maxLength(10).description('方案名称').required())
  .prop('KSRQ', S.string().maxLength(8).description('开始日期').required())
  .prop('JSRQ', S.string().maxLength(8).description('结束日期').required())
  .prop('QSSJ', S.string().maxLength(6).description('起始时间').required())
  .prop('SM', S.string().maxLength(64).description('说明'))