/*
 * @description: 注册基础教育数据库模型
 * @author: zpl
 * @Date: 2021-04-10 15:57:54
 * @LastEditTime: 2021-04-13 19:02:58
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'
import Sequelize from 'sequelize'

import prodConf from '../configure_production.js'
import devConf from '../configure_dev.js'
import registerModels from '../models/business_basis/index.js'

async function plugin(fastify, options) {
  const { config } = fastify;
  const seqConf = config.NODE_ENV === 'production' ? prodConf.mysql.business_basis : devConf.mysql.business_basis
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
  registerModels(sequelize, resetTable);
  if (autoConnect) {
    return sequelize.authenticate().then(decorate)
  }
  sequelize.sync()
  decorate()
  return Promise.resolve();

  function decorate() {
    fastify.decorate('mysql_basis', sequelize)
    fastify.addHook('onClose', (fastifyInstance, done) => {
      sequelize.close()
        .then(done)
        .catch(done)
    })
  }
}

export default fp(plugin, {
  name: 'mysql_basis'
})