/*
 * @description: 少数民族双语教学模式代码
 * @author: zpl
 * @Date: 2021-04-21 14:59:01
 * @LastEditTime: 2021-04-21 17:10:29
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize
export default () => {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dmlb: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'SSMZSYJXMS', comment: '代码类别' },
    dm: { type: DataTypes.STRING(4), allowNull: false, unique: true, comment: '代码' },
    dmhy: { type: DataTypes.STRING(20), allowNull: false, comment: '代码含义' },
    dmsm: { type: DataTypes.STRING(64), comment: '代码说明' }
  }
}
export const InfoSchema = S.object()
  .id('SSMZSYJXMS')
  .description('少数民族双语教学模式代码')
  .prop('id', S.string().format('uuid').required())
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('mchy', S.string().maxLength(20).description('代码含义').required())
  .prop('mcsm', S.string().maxLength(64).description('代码说明'))

export const CreateSchema = S.object()
  .id('CreateSSMZSYJXMS')
  .description('创建少数民族双语教学模式代码')
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('mchy', S.string().maxLength(20).description('代码含义').required())
  .prop('mcsm', S.string().maxLength(64).description('代码说明'))