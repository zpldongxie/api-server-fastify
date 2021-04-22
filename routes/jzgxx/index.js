/*
 * @description: 教职工信息相关路由
 * @author: zpl
 * @Date: 2021-04-22 14:57:23
 * @LastEditTime: 2021-04-22 17:48:13
 * @LastEditors: zpl
 */
import Schema from './schema.js'

// 设置路由前缀
export const autoPrefix = '/auth'

export default async function auth(fastify, opts) {
  const schema = new Schema(fastify);
  const {
    httpErrors,
    jwt_auth,
    csrfProtection,
    mysql_basis
  } = fastify

  fastify.addHook('onRequest', jwt_auth)

  // 创建教职工基本数据
  fastify.route({
    method: 'PUT',
    path: '/create',
    schema: schema.CreateJZG,
    onRequest: csrfProtection,
    handler: async (req, res) => {
      const { JZGJBSJ } = mysql_basis.models;
      const jzg = await JZGJBSJ.create(req.body);
      if (!jzg) {
        throw httpErrors.internalServerError('教职工基本数据创建失败')
      }
      // const usr = jzg.toJSON();
      return jzg
    }
  })
}