/*
 * @description: 作息时间
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-13 20:02:23
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  SD: { type: DataTypes.STRING(10), allowNull: false, comment: '上课时段' },
  SX: { type: DataTypes.STRING(10), allowNull: false, comment: '上课属性' },
  KSSJ: { type: DataTypes.STRING(6), allowNull: false, comment: '开始时间' },
  JSSJ: { type: DataTypes.STRING(6), allowNull: false, comment: '结束时间' },
  SYXQ: { type: DataTypes.STRING(30), allowNull: false, comment: '适用星期' },
}

export const InfoSchema = S.object()
  .id('ZXSJ')
  .description('作息时间')
  .prop('id', S.string().format('uuid').required())
  .prop('SD', S.string().maxLength(10).description('上课时段').required())
  .prop('SX', S.string().maxLength(10).description('上课属性').required())
  .prop('KSSJ', S.string().maxLength(6).description('开始时间').required())
  .prop('JSSJ', S.string().maxLength(6).description('结束时间').required())
  .prop('SYXQ', S.string().maxLength(30).description('适用星期').required())

export const CreateSchema = S.object()
  .id('CreateZXSJ')
  .description('创建作息时间')
  .prop('SD', S.string().maxLength(10).description('上课时段').required())
  .prop('SX', S.string().maxLength(10).description('上课属性').required())
  .prop('SYXQ', S.string().maxLength(30).description('适用星期').required())

export const UpdateSchema = S.object()
  .id('UpdateZXSJ')
  .description('更新作息时间')
  .prop('id', S.string().format('uuid').required())
  .prop('SD', S.string().maxLength(10).description('上课时段').required())
  .prop('SX', S.string().maxLength(10).description('上课属性').required())
  .prop('SYXQ', S.string().maxLength(30).description('适用星期').required())