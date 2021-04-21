/*
 * @description: 
 * @author: zpl
 * @Date: 2021-04-12 15:31:57
 * @LastEditTime: 2021-04-21 11:07:51
 * @LastEditors: zpl
 */
import S from 'fluent-json-schema'
import { publicSchema, CreateSchema } from '../../models/edu_platform/schemas/user.js'

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
    this.fastify.addSchema(CreateSchema)
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

  get CreateUser() {
    return {
      tags: ['user'],
      operationId: 'createUser',
      summary: '创建用户',
      description: '',
      body: S.ref('CreateUser#'),
      response: {
        200: S.ref('CurrentUser#'),
      }
    }
  }
}