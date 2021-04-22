/*
 * @description: 
 * @author: zpl
 * @Date: 2021-04-22 14:58:39
 * @LastEditTime: 2021-04-22 17:39:13
 * @LastEditors: zpl
 */
import S from 'fluent-json-schema'
import { InfoSchema, CreateSchema } from '../../models/business_basis/schemas/jzgjbsj.js'

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
    this.fastify.addSchema(InfoSchema)
    this.fastify.addSchema(CreateSchema)
  }

  get CreateJZG() {
    return {
      tags: ['jzgjbsj'],
      operationId: 'createJZG',
      summary: '创建教职工基本数据',
      description: '',
      body: S.ref('CreateJZGJBSJ#'),
      response: {
        201: S.ref('JZGJBSJ#'),
      }
    }
  }
}