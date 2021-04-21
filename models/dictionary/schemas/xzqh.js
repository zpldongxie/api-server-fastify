/*
 * @description: 中华人民共和国行政区划代码
 * @author: zpl
 * @Date: 2020-01-02 22:45:05
 * @LastEditTime: 2021-04-21 16:19:16
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
    lx: { type: DataTypes.STRING(8), allowNull: false, defaultValue: 'B.1', comment: '类型' },
    dm: { type: DataTypes.STRING(6), allowNull: false, unique: true, comment: '代码' },
    mc: { type: DataTypes.STRING(20), allowNull: false, comment: '名称' },
  }
};
export const InfoSchema = S.object()
  .id('XZQH')
  .description('行政区划代码')
  .prop('id', S.string().format('uuid').required())
  .prop('lx', S.string().maxLength(8).description('类型').required())
  .prop('dm', S.string().maxLength(6).description('代码').required())
  .prop('mc', S.string().maxLength(20).description('名称').required())

export const CreateSchema = S.object()
  .id('CreateXZQH')
  .description('创建行政区划代码')
  .prop('lx', S.string().maxLength(8).description('类型').required())
  .prop('dm', S.string().maxLength(6).description('代码').required())
  .prop('mc', S.string().maxLength(20).description('名称').required())
