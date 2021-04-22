/*
 * @description: 世界各国和地区名称代码
 * @author: zpl
 * @Date: 2021-04-21 13:57:45
 * @LastEditTime: 2021-04-22 09:01:47
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
    dmlb: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'B.8', comment: '代码类别' },
    dm: { type: DataTypes.STRING(4), allowNull: false, unique: true, comment: '代码' },
    jc: { type: DataTypes.STRING(20), allowNull: false, comment: '国家/地区名称简称' },
    dm_2: { type: DataTypes.STRING(2), allowNull: false, comment: '二字母代码' },
    dm_3: { type: DataTypes.STRING(3), allowNull: false, comment: '三字母代码' },
    dmsm: { type: DataTypes.STRING(20), comment: '代码说明' }
  }
};
export const InfoSchema = S.object()
  .id('XB')
  .description('国家地区代码')
  .prop('id', S.string().format('uuid').required())
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('jc', S.string().maxLength(20).description('国家/地区名称简称').required())
  .prop('dm_2', S.string().maxLength(2).description('二字母代码').required())
  .prop('dm_3', S.string().maxLength(3).description('三字母代码').required())
  .prop('mcsm', S.string().maxLength(20).description('代码说明'))

export const CreateSchema = S.object()
  .id('CreateXB')
  .description('创建国家地区代码')
  .prop('dmlb', S.string().maxLength(10).description('代码类别').required())
  .prop('dm', S.string().maxLength(4).description('代码').required())
  .prop('jc', S.string().maxLength(20).description('国家/地区名称简称').required())
  .prop('dm_2', S.string().maxLength(2).description('二字母代码').required())
  .prop('dm_3', S.string().maxLength(3).description('三字母代码').required())
  .prop('mcsm', S.string().maxLength(20).description('代码说明'))
