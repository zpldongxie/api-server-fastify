/*
 * @description: 中华人民共和国行政区划代码
 * @author: zpl
 * @Date: 2020-01-02 22:45:05
 * @LastEditTime: 2020-01-02 22:53:49
 * @LastEditors: zpl
 */
export const loadSchema = function (DataTypes) {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lx: { type: DataTypes.STRING, allowNull: false, comment: '类型' },
    dm: { type: DataTypes.STRING, allowNull: false, unique: true, comment: '代码' },
    mc: { type: DataTypes.STRING, allowNull: false, comment: '名称' },
  }
};
export const publicSchema = {
  lx: { type: 'string' },
  dm: { type: 'string' },
  mc: { type: 'string' },
};
export const privateSchema = {
  id: { type: 'string' },
  lx: { type: 'string' },
  dm: { type: 'string' },
  mc: { type: 'string' },
};