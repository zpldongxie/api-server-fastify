/*
 * @description: 
 * @author: zpl
 * @Date: 2021-04-10 17:19:07
 * @LastEditTime: 2021-04-20 10:10:42
 * @LastEditors: zpl
 */
export default {
  mysql: {
    // 字典数据库
    dictionary: {
      instance: 'dictionary',
      host: "127.0.0.1",
      database: "edu_dictionary",
      user: "root",
      password: "Clouddeep@8890",
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquie: 30000,
        idle: 10000,
      },
      needCreatTable: false, // 同步模型到数据库
      dropOldTable: false, // 同步前清空所有旧表
    },
    // 基础教育数据库
    business_basis: {
      instance: 'business_basis',
      host: "127.0.0.1",
      database: "edu_business_basis",
      user: "root",
      password: "Clouddeep@8890",
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquie: 30000,
        idle: 10000,
      },
      needCreatTable: false, // 同步模型到数据库
      dropOldTable: false, // 同步前清空所有旧表
    },
    // 智慧教育平台
    edu_platform: {
      host: "127.0.0.1",
      database: "edu_platform",
      user: "root",
      password: "Clouddeep@8890",
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquie: 30000,
        idle: 10000,
      },
      autoConnect: true,
      resetTable: false,
    }
  },
  jwt: {
    secret: 'WW14dlp5NTZhSFZ3Wlc1bmJHbGhibWN1WTI0JTNE'
  }
}