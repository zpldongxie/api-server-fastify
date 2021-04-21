/*
 * @description: 学制代码
 * @author: zpl
 * @Date: 2021-04-21 13:57:45
 * @LastEditTime: 2021-04-21 16:15:47
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
    dmlb: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'XZ', comment: '代码类别' },
    dm: { type: DataTypes.STRING(4), allowNull: false, unique: true, comment: '代码' },
    dmhy: { type: DataTypes.STRING(20), allowNull: false, comment: '代码含义' },
    syxx: { type: DataTypes.STRING(6), allowNull: false, comment: '使用学校' }
  }
};
export const InfoSchema = S.object()
  .id('XZ')
  .description('学制代码')
  .prop('id', S.string().format('uuid').required())
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('mchy', S.string().maxLength(20).description('代码含义').required())
  .prop('syxx', S.string().maxLength(6).description('使用学校'))

export const CreateSchema = S.object()
  .id('CreateXZ')
  .description('创建学制代码')
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('mchy', S.string().maxLength(20).description('代码含义').required())
  .prop('syxx', S.string().maxLength(6).description('使用学校'))
