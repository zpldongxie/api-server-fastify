/*
 * @description: 学校基本数据
 * @author: zpl
 * @Date: 2021-04-13 14:12:07
 * @LastEditTime: 2021-04-17 19:32:51
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import S from 'fluent-json-schema'

const { DataTypes } = Sequelize

export default (XXDM) => ({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, },
  XXDM: { type: DataTypes.STRING(32), defaultValue: XXDM, comment: '学校代码' },
  XXMC: { type: DataTypes.STRING(64), allowNull: false, comment: '学校名称' },
  XXYWMC: { type: DataTypes.STRING(64), comment: '学校英文名称' },
  XXDZ: { type: DataTypes.STRING(128), allowNull: false, comment: '学校地址' },
  XXYZBM: { type: DataTypes.STRING(6), allowNull: false, comment: '学校邮政编码' },
  XZQHM: { type: DataTypes.STRING(6), allowNull: false, comment: '行政区划码' },
  JXNY: { type: DataTypes.STRING(6), allowNull: false, comment: '建校年月' },
  XQR: { type: DataTypes.STRING(60), allowNull: false, comment: '校庆日' },
  XXBXLXM: { type: DataTypes.STRING(3), allowNull: false, comment: '学校办学类型码' },
  XXZGBMM: { type: DataTypes.STRING(6), allowNull: false, comment: '学校主管部门码' },
  FDDBRH: { type: DataTypes.STRING(36), comment: '法定代表人号' },
  FRZSH: { type: DataTypes.STRING(20), allowNull: false, comment: '法人证书号' },
  XZGH: { type: DataTypes.STRING(36), comment: '校长工号' },
  XZXM: { type: DataTypes.STRING(36), allowNull: false, comment: '校长姓名' },
  DWFZRH: { type: DataTypes.STRING(36), comment: '党委负责人号' },
  ZZJGM: { type: DataTypes.STRING(10), comment: '组织机构码' },
  LXDH: { type: DataTypes.STRING(32), allowNull: false, comment: '联系电话' },
  CZDH: { type: DataTypes.STRING(32), allowNull: false, comment: '传真电话' },
  DZXX: { type: DataTypes.STRING(32), allowNull: false, comment: '电子信箱' },
  ZYDZ: { type: DataTypes.STRING(32), allowNull: false, comment: '主页地址' },
  LSYG: { type: DataTypes.STRING(255), comment: '历史沿革' },
  XXBBM: { type: DataTypes.STRING(2), allowNull: false, comment: '学校办别码' },
  SSZGDWM: { type: DataTypes.STRING(6), allowNull: false, comment: '所属主管单位码' },
  SZDCXLXM: { type: DataTypes.STRING(6), allowNull: false, comment: '所在地城乡类型码' },
  SZDJJSXM: { type: DataTypes.STRING(1), allowNull: false, comment: '所在地经济属性码' },
  SZDMZSX: { type: DataTypes.STRING(1), allowNull: false, comment: '所在地民族属性' },
  XXXZ: { type: DataTypes.INTEGER, comment: '小学学制' },
  XXRXNL: { type: DataTypes.INTEGER, comment: '小学入学年龄' },
  CZXZ: { type: DataTypes.INTEGER, comment: '初中学制' },
  CZRXNL: { type: DataTypes.INTEGER, comment: '初中入学年龄' },
  GZXZ: { type: DataTypes.INTEGER, comment: '高中学制' },
  ZJXYYM: { type: DataTypes.STRING(3), allowNull: false, comment: '主教学语言码' },
  FJXYYM: { type: DataTypes.STRING(3), allowNull: false, comment: '辅教学语言码' },
  ZSBJ: { type: DataTypes.STRING(30), comment: '招生半径' },
})

export const InfoSchema = S.object()
  .id('XXJBSJ')
  .description('学校基本数据')
  .prop('id', S.string().format('uuid').required())
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('XXMC', S.string().maxLength(64).description('学校名称').required())
  .prop('XXYWMC', S.string().maxLength(64).description('学校英文名称'))
  .prop('XXDZ', S.string().maxLength(128).description('学校地址').required())
  .prop('XXYZBM', S.string().maxLength(6).description('学校邮政编码').required())
  .prop('XZQHM', S.string().maxLength(6).description('行政区划码').required())
  .prop('JXNY', S.string().maxLength(6).description('建校年月').required())
  .prop('XQR', S.string().maxLength(60).description('校庆日').required())
  .prop('XXBXLXM', S.string().maxLength(3).description('学校办学类型码').required())
  .prop('XXZGBMM', S.string().maxLength(6).description('学校主管部门码').required())
  .prop('FDDBRH', S.string().maxLength(36).description('法定代表人号'))
  .prop('FRZSH', S.string().maxLength(20).description('法人证书号').required())
  .prop('XZGH', S.string().maxLength(36).description('校长工号'))
  .prop('XZXM', S.string().maxLength(36).description('校长姓名').required())
  .prop('DWFZRH', S.string().maxLength(36).description('党委负责人号'))
  .prop('ZZJGM', S.string().maxLength(10).description('组织机构码'))
  .prop('LXDH', S.string().maxLength(32).description('联系电话').required())
  .prop('CZDH', S.string().maxLength(32).description('传真电话').required())
  .prop('DZXX', S.string().maxLength(32).description('电子信箱').required())
  .prop('ZYDZ', S.string().maxLength(32).description('主页地址').required())
  .prop('LSYG', S.string().maxLength(255).description('历史沿革'))
  .prop('XXBBM', S.string().maxLength(2).description('学校办别码').required())
  .prop('SSZGDWM', S.string().maxLength(6).description('所属主管单位码').required())
  .prop('SZDCXLXM', S.string().maxLength(6).description('所在地城乡类型码').required())
  .prop('SZDJJSXM', S.string().maxLength(1).description('所在地经济属性码').required())
  .prop('SZDMZSX', S.string().maxLength(1).description('所在地民族属性').required())
  .prop('XXXZ', S.number().description('小学学制'))
  .prop('XXRXNL', S.number().description('小学入学年龄'))
  .prop('CZXZ', S.number().description('初中学制'))
  .prop('CZRXNL', S.number().description('初中入学年龄'))
  .prop('GZXZ', S.number().description('高中学制'))
  .prop('ZJXYYM', S.string().maxLength(3).description('主教学语言码').required())
  .prop('FJXYYM', S.string().maxLength(3).description('辅教学语言码').required())
  .prop('ZSBJ', S.string().maxLength(30).description('招生半径'))

export const CreateSchema = S.object()
  .id('CreateXXJBSJ')
  .description('创建学校基本数据')
  .prop('XXDM', S.string().maxLength(32).description('学校代码').required())
  .prop('XXMC', S.string().maxLength(64).description('学校名称').required())
  .prop('XXYWMC', S.string().maxLength(64).description('学校英文名称'))
  .prop('XXDZ', S.string().maxLength(128).description('学校地址').required())
  .prop('XXYZBM', S.string().maxLength(6).description('学校邮政编码').required())
  .prop('XZQHM', S.string().maxLength(6).description('行政区划码').required())
  .prop('JXNY', S.string().maxLength(6).description('建校年月').required())
  .prop('XQR', S.string().maxLength(60).description('校庆日').required())
  .prop('XXBXLXM', S.string().maxLength(3).description('学校办学类型码').required())
  .prop('XXZGBMM', S.string().maxLength(6).description('学校主管部门码').required())
  .prop('FDDBRH', S.string().maxLength(36).description('法定代表人号'))
  .prop('FRZSH', S.string().maxLength(20).description('法人证书号').required())
  .prop('XZGH', S.string().maxLength(36).description('校长工号'))
  .prop('XZXM', S.string().maxLength(36).description('校长姓名').required())
  .prop('DWFZRH', S.string().maxLength(36).description('党委负责人号'))
  .prop('ZZJGM', S.string().maxLength(10).description('组织机构码'))
  .prop('LXDH', S.string().maxLength(32).description('联系电话').required())
  .prop('CZDH', S.string().maxLength(32).description('传真电话').required())
  .prop('DZXX', S.string().maxLength(32).description('电子信箱').required())
  .prop('ZYDZ', S.string().maxLength(32).description('主页地址').required())
  .prop('LSYG', S.string().maxLength(255).description('历史沿革'))
  .prop('XXBBM', S.string().maxLength(2).description('学校办别码').required())
  .prop('SSZGDWM', S.string().maxLength(6).description('所属主管单位码').required())
  .prop('SZDCXLXM', S.string().maxLength(6).description('所在地城乡类型码').required())
  .prop('SZDJJSXM', S.string().maxLength(1).description('所在地经济属性码').required())
  .prop('SZDMZSX', S.string().maxLength(1).description('所在地民族属性').required())
  .prop('XXXZ', S.number().description('小学学制'))
  .prop('XXRXNL', S.number().description('小学入学年龄'))
  .prop('CZXZ', S.number().description('初中学制'))
  .prop('CZRXNL', S.number().description('初中入学年龄'))
  .prop('GZXZ', S.number().description('高中学制'))
  .prop('ZJXYYM', S.string().maxLength(3).description('主教学语言码').required())
  .prop('FJXYYM', S.string().maxLength(3).description('辅教学语言码').required())
  .prop('ZSBJ', S.string().maxLength(30).description('招生半径'))
