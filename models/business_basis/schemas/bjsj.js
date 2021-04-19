/*
 * @description: 班级数据
 * @author: zpl
 * @Date: 2021-04-13 16:55:03
 * @LastEditTime: 2021-04-17 19:29:59
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  BH: { type: DataTypes.STRING(10), comment: '班号', allowNull: false },
  BJ: { type: DataTypes.STRING(20), comment: '班级', allowNull: false },
  JBNY: { type: DataTypes.STRING(6), comment: '建班年月', allowNull: false },
  BZRGH: { type: DataTypes.STRING(36), comment: '班主任工号', allowNull: false },
  BZXH: { type: DataTypes.STRING(16), comment: '班长学号', },
  BJRYCH: { type: DataTypes.STRING(40), comment: '班级荣誉称号', },
  XZ: { type: DataTypes.STRING(1), comment: '学制', },
  BJLXM: { type: DataTypes.STRING(2), comment: '班级类型码', },
  WLLX: { type: DataTypes.STRING(2), comment: '文理类型', },
  BYRQ: { type: DataTypes.STRING(8), comment: '毕业日期', },
  SFSSMZSYJXB: { type: DataTypes.STRING(1), comment: '是否少数民族双语教学班', allowNull: false },
  SYJXMSM: { type: DataTypes.STRING(1), comment: '双语教学模式码', allowNull: false },
})

export const InfoSchema = S.object()
  .id('BJSJ')
  .description('班级数据')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('BH', S.string().maxLength(10).description('班号').required())
  .prop('BJ', S.string().maxLength(20).description('班级').required())
  .prop('JBNY', S.string().maxLength(6).description('建班年月').required())
  .prop('BZRGH', S.string().maxLength(36).description('班主任工号').required())
  .prop('BZXH', S.string().maxLength(16).description('班长学号'))
  .prop('BJRYCH', S.string().maxLength(40).description('班级荣誉称号'))
  .prop('XZ', S.string().maxLength(1).description('学制'))
  .prop('BJLXM', S.string().maxLength(2).description('班级类型码'))
  .prop('WLLX', S.string().maxLength(2).description('文理类型'))
  .prop('BYRQ', S.string().maxLength(8).description('毕业日期'))
  .prop('SFSSMZSYJXB', S.string().maxLength(1).description('是否少数民族双语教学班').required())
  .prop('SYJXMSM', S.string().maxLength(1).description('双语教学模式码').required())

export const CreateSchema = S.object()
  .id('CreateBJSJ')
  .description('创建班级数据')
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('BH', S.string().maxLength(10).description('班号').required())
  .prop('BJ', S.string().maxLength(20).description('班级').required())
  .prop('JBNY', S.string().maxLength(6).description('建班年月').required())
  .prop('BZRGH', S.string().maxLength(36).description('班主任工号').required())
  .prop('BZXH', S.string().maxLength(16).description('班长学号'))
  .prop('BJRYCH', S.string().maxLength(40).description('班级荣誉称号'))
  .prop('XZ', S.string().maxLength(1).description('学制'))
  .prop('BJLXM', S.string().maxLength(2).description('班级类型码'))
  .prop('WLLX', S.string().maxLength(2).description('文理类型'))
  .prop('BYRQ', S.string().maxLength(8).description('毕业日期'))
  .prop('SFSSMZSYJXB', S.string().maxLength(1).description('是否少数民族双语教学班').required())
  .prop('SYJXMSM', S.string().maxLength(1).description('双语教学模式码').required())