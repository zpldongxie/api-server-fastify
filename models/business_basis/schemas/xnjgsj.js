/*
 * @description: 校内机构数据
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-13 19:26:30
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  JGH: {	type: DataTypes.STRING(10), allowNull: false, comment: '机构号' },
  LSJGH: {	type: DataTypes.STRING(10), allowNull: false, comment: '隶属机构号' },
  JGMC: {	type: DataTypes.STRING(60), allowNull: false, comment: '机构名称' },
  JGJC: {	type: DataTypes.STRING(10), allowNull: false, comment: '机构简称' },
  FZRGH: {	type: DataTypes.STRING(36), comment: '负责人工号' },
})

export const InfoSchema = S.object()
  .id('XNJGSJ')
  .description('校内机构数据')
  .prop('id', S.string().format('uuid').required())
  .prop('JGH', S.string().maxLength(10).description('机构号').required())
  .prop('LSJGH', S.string().maxLength(10).description('隶属机构号').required())
  .prop('JGMC', S.string().maxLength(60).description('机构名称').required())
  .prop('JGJC', S.string().maxLength(10).description('机构简称').required())
  .prop('FZRGH', S.string().maxLength(36).description('负责人工号'))

export const CreateSchema = S.object()
  .id('CreateXNJGSJ')
  .description('创建校内机构数据')
  .prop('JGH', S.string().maxLength(10).description('机构号').required())
  .prop('LSJGH', S.string().maxLength(10).description('隶属机构号').required())
  .prop('JGMC', S.string().maxLength(60).description('机构名称').required())
  .prop('JGJC', S.string().maxLength(10).description('机构简称').required())
  .prop('FZRGH', S.string().maxLength(36).description('负责人工号'))