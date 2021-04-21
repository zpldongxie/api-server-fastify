/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2021-04-21 11:53:13
 * @LastEditors: zpl
 * 
 */
import Xzqhdm from './xzqhdm.js'

/**
 * 注册models
 *
 * @param {*} sequelize 数据库映射对象
 * @param {*} config 配置信息
 */
 const registerModels = async (sequelize, config) => {
    const { resetTable } = config;
    const models = {
        Xzqhdm: Xzqhdm.init(sequelize)
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
        console.log(` - ${model.name}`)
        if (resetTable && typeof model.initData === 'function') {
            await model.initData()
        }
    }
}

export default registerModels;