/*
 * @description: 中华人民共和国行政区划代码
 * @author: zpl
 * @Date: 2021-04-10 16:05:25
 * @LastEditTime: 2020-01-03 01:27:09
 * @LastEditors: zpl
 */
import Sequelize from 'sequelize'
import { loadSchema } from './schemas/xzqhdm.js'
import data from './initData/xzqhdm.js'

const { Model } = Sequelize;

class Xzqhdm extends Model {
    static associate(models) {
        //No asociations
    }
    static getId(where) {
        return this.findOne({
            where,
            attributes: ["id"],
        });
    }
    static init(sequelize, DataTypes) {
        return super.init(loadSchema(DataTypes), {
            tableName: "xzqhdm",
            sequelize,
            timestamps: false,
            comment: '中华人民共和国行政区划代码',
        })
    }
    static async initData() {
        await this.destroy({ where: {} })
        const list = data.map(d => ({
            lx: d[0],
            dm: d[1],
            mc: d[2]
        }))
        await this.bulkCreate(list)
    }
    toJSON() {
        return {
            id: this.id,
            lx: this.lx,
            dm: this.dm,
            mc: this.mc,
        }
    }
}

export default Xzqhdm;