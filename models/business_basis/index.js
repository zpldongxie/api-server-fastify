/*
 * @description: 统一加载所有model
 * @author: zpl
 * @Date: 2021-04-10 16:02:59
 * @LastEditTime: 2020-01-03 20:34:48
 * @LastEditors: zpl
 * 
 */
import Sequelize from 'sequelize'
import User from './user.js'

const { DataTypes } = Sequelize

export default (sequelize, resetTable) => {
    const models = {
        User: User.init(sequelize, DataTypes)
    }
    console.log("Importing business_basis models...")
    Object.values(models)
        .filter(model => typeof model.associate === "function")
        .forEach(model => {
            model.associate(models)
            model.sync({
                match: new RegExp('^' + sequelize.config.database + '$'),
                // alter: process.env.NODE_ENV != 'production',
                force: resetTable
            });
            console.log(` - ${model.name}`)
        });
}