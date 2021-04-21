/*
 * @description: 注册业务数据库模型
 * @author: zpl
 * @Date: 2021-04-10 15:57:54
 * @LastEditTime: 2021-04-21 09:54:30
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'
import Sequelize from 'sequelize'

import prodConf from '../configure_production.js'
import devConf from '../configure_dev.js'
import registerModels from '../models/edu_platform/index.js'

async function plugin(fastify, options) {
  const { config } = fastify;
  const seqConf = config.NODE_ENV === 'production' ? prodConf.mysql.edu_platform : devConf.mysql.edu_platform
  const { database, user, password, host, dialect, pool, autoConnect, resetTable } = seqConf;
  let sequelize = new Sequelize(database, user, password, {
    host,
    dialect,
    pool,
    logging: false,
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_general_ci',
      },
    },
  })
  registerModels(sequelize, { ...config, resetTable });
  if (autoConnect) {
    return sequelize.authenticate().then(decorate)
  }
  sequelize.sync()
  decorate()
  return Promise.resolve();

  function decorate() {
    fastify.decorate('mysql_edu_platform', sequelize)
    fastify.addHook('onClose', (fastifyInstance, done) => {
      sequelize.close()
        .then(done)
        .catch(done)
    })
  }
}

export default fp(plugin, {
  name: 'mysql_edu_platform'
})