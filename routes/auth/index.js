/*
 * @description: 
 * @author: zpl
 * @Date: 2020-01-02 21:18:30
 * @LastEditTime: 2021-04-12 13:50:38
 * @LastEditors: zpl
 */
import User from '../../models/business_basis/user.js'
import Schema from './schema.js'

// 设置路由前缀
export const autoPrefix = '/auth'

export default async function auth(fastify, opts) {
  const {
    httpErrors,
    elastic,
    indices,
    jwt,
    csrfProtection
  } = fastify

  const schema = new Schema(fastify);

  fastify.route({
    method: 'POST',
    url: '/account',
    schema: schema.postAccount,
    handler: async (req, res) => {
      const { edu_platform } = req.cookies
      if (edu_platform) {
        res.clearCookie('edu_platform', { path: '/' })
      }

      /**@type {User}*/
      const user = fastify.mysql_basis.models.User;
      /**@type {User}*/
      let usr = await user.getUsernameAndPassword(req.body.username, req.body.password)
      if (usr != null) {
        const token = jwt.sign({ userId: usr.id })
        res.setCookie('edu_platform', token, { path: '/' });
        return {
          status: 'ok',
          currentAuthority: [usr.username],
          token,
          type: req.body.type
        }
      } else {
        throw httpErrors.unauthorized('用户名或密码错误')
      }
    }
  })
}