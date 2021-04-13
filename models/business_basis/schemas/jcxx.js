/*
 * @description: 节次信息
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-13 19:40:11
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  MC: { type: DataTypes.STRING(20), allowNull: false, comment: '名称' },
  YWMC: { type: DataTypes.STRING(32), comment: '英文名称' },
  SC: { type: DataTypes.INTEGER, allowNull: false, comment: '时长' },
  SM: { type: DataTypes.STRING(64), comment: '说明' },
}

export const InfoSchema = S.object()
  .id('JCXX')
  .description('节次信息')
  .prop('id', S.string().format('uuid').required())
  .prop('MC', S.string().maxLength(20).description('名称').required())
  .prop('YWMC', S.string().maxLength(32).description('英文名称'))
  .prop('SC', S.number().description('时长').required())
  .prop('SM', S.string().maxLength(64).description('说明'))

export const CreateSchema = S.object()
  .id('CreateJCXX')
  .description('创建节次信息')
  .prop('MC', S.string().maxLength(20).description('名称').required())
  .prop('YWMC', S.string().maxLength(32).description('英文名称'))
  .prop('SC', S.number().description('时长').required())
  .prop('SM', S.string().maxLength(64).description('说明'))