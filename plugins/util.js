/*
 * @description: 工具类
 * @author: zpl
 * @Date: 2020-01-02 22:57:17
 * @LastEditTime: 2020-01-02 23:08:13
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'
import Sequelize from 'sequelize'

const convertDataType = (dataType) => {
  switch (dataType) {
      case Sequelize.INTEGER:
          return 'integer'
      case Sequelize.NUMBER:
          return 'number'
      case Sequelize.STRING:
          return 'string'
      case Sequelize.ARRAY:
          return 'array'
      case Sequelize.BOOLEAN:
          return 'boolean'
      case Sequelize.FLOAT:
          return 'number'
      case Sequelize.DATE:
          return 'string'
      case Sequelize.UUID:
          return 'string'
      default:
          throw new Error('Not implemented yet!!!!')
  }
}

const schema2response = (sch) => {
  let schK = Object.keys(sch);
  return schK.reduce((total, current, i, arr) => {
      if (!!sch[current]) {
          let type = convertDataType(sch[current].type)
          if (type == 'object' && !!sch[current].properties) {
              total[current] = {
                  type: 'object',
                  properties: schema2response(sch[current].properties)
              }
          }else{
              total[current] = {type}
          }
      }
      return total;
  }, {})
}

async function util (fastify, opts) {
  fastify.decorate('schema2response', schema2response)
}

export default fp(util, {
  name: 'util'
})