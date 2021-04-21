/*
 * @description: 
 * @author: zpl
 * @Date: 2021-04-10 17:19:07
 * @LastEditTime: 2021-04-21 11:54:45
 * @LastEditors: zpl
 */
export default {
  mysql: {
    // 字典数据库
    dictionary: {
      host: "49.233.193.39",
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
      autoConnect: true,
      resetTable: false,
    },
    // 基础教育数据
    business_basis: {
      host: "49.233.193.39",
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
      autoConnect: true,
      resetTable: false,
    },
    // 智慧教育平台
    edu_platform: {
      host: "49.233.193.39",
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