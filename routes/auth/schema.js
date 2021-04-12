/*
 * @description: 
 * @author: zpl
 * @Date: 2020-01-03 20:24:04
 * @LastEditTime: 2020-01-04 00:49:01
 * @LastEditors: zpl
 */
import S from 'fluent-json-schema'

/** 登录参数 */
const LoginParams = S.object()
  .id('LoginParams')
  .prop('username', S.string().description('登录名').required())
  .prop('password', S.string().description('密码').required())
  .prop('autoLogin', S.boolean().description('自动登录').required())
  .prop('type', S.string().enum(['account', 'mobile']).required())

/** 登录返回 */
const LoginResult = S.object()
  .id('LoginResult')
  .description('登录成功')
  .prop('status', S.string().enum(['ok', 'error']).required())
  .prop('currentAuthority', S.array().items(S.string()).required())
  .prop('token', S.string().required())
  .prop('type', S.string().enum(['account', 'mobile']).required())

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
    this.fastify.addSchema(LoginParams)
    this.fastify.addSchema(LoginResult)
  }

  /**
   * 账密登录
   *
   * @readonly
   */
  get postAccount() {
    return {
      tags: ['auth'],
      operationId: 'postAccount',
      summary: '账密登录',
      description: '',
      body: S.ref('LoginParams#'),
      response: {
        200: S.ref('LoginResult#'),
        401: S.object()
          .description('登录失败')
          .prop('statusCode', S.number())
          .prop('message', S.string())
      }
    }
  }
}

// /** 账密登录 */
// export const postAccount = {
//   tags: ['auth'],
//   operationId: 'postAccount',
//   summary: '账密登录',
//   description: '',
//   body: S.ref('#LoginParams'),
//   response: {
//     200: S.ref('#LoginResult'),
//     401: S.object()
//       .description('登录失败')
//       .prop('statusCode', S.number())
//       .prop('message', S.string())
//   }
// }
