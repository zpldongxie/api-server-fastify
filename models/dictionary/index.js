/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2020-01-03 20:07:20
 * @LastEditors: zpl
 * 
 */
import Sequelize from 'sequelize'
import Xzqhdm from './xzqhdm.js'

const { DataTypes } = Sequelize

export default async (sequelize, resetTable) => {
    const models = {
        Xzqhdm: Xzqhdm.init(sequelize, DataTypes)
    }
    console.log("Importing dictionary models...")
    const modelList = Object.values(models)
        .filter(model => typeof model.associate === "function")
    for (const model of modelList) {
        model.associate(models)
        await model.sync({
            match: new RegExp('^' + sequelize.config.database + '$'),
            // TODO: 频繁同步时如果有唯一约束，会不断创建索引产生脏数据，待解决
            // alter: process.env.NODE_ENV != 'production',
            force: resetTable
        });
        if (resetTable && typeof model.initData === 'function') {
            model.initData()
        }
        console.log(` - ${model.name}`)
    }
}