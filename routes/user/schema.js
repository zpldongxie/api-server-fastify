/*
 * @description: 
 * @author: zpl
 * @Date: 2021-04-12 15:31:57
 * @LastEditTime: 2021-04-12 15:55:41
 * @LastEditors: zpl
 */
import S from 'fluent-json-schema'
import { privateSchema, publicSchema } from '../../models/business_basis/schemas/user.js'

export default class {
  constructor(fastify) {
    this.fastify = fastify;
    this.regSchema();
  }

  /**
   * 注册公共Scheam
   *
   */
  regSchema() {
    this.fastify.addSchema(publicSchema)
    this.fastify.addSchema(privateSchema)
  }

  /**
   * 获取当前用户
   *
   * @readonly
   */
  get currentUser() {
    return {
      tags: ['user'],
      operationId: 'currentUser',
      summary: '获取当前用户',
      description: '',
      response: {
        200: S.ref('CurrentUser#'),
      }
    }
  }
}