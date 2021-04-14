/*
 * @description: 校历
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-13 19:45:34
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  BT: { type: DataTypes.STRING(32), allowNull: false, comment: '标题' },
  KSRQ: { type: DataTypes.STRING(8), allowNull: false, comment: '开始日期' },
  JSRQ: { type: DataTypes.STRING(8), allowNull: false, comment: '结束日期' },
})

export const InfoSchema = S.object()
  .id('XL')
  .description('校历')
  .prop('id', S.string().format('uuid').required())
  .prop('BT', S.string().maxLength(32).description('标题'))
  .prop('KSRQ', S.string().maxLength(8).description('开始日期'))
  .prop('JSRQ', S.string().maxLength(8).description('结束日期'))

export const CreateSchema = S.object()
  .id('CreateXL')
  .description('创建校历')
  .prop('BT', S.string().maxLength(32).description('标题'))
  .prop('KSRQ', S.string().maxLength(8).description('开始日期'))
  .prop('JSRQ', S.string().maxLength(8).description('结束日期'))