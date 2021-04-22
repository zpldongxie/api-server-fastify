/*
 * @description: 
 * @author: zpl
 * @Date: 2020-01-02 21:18:30
 * @LastEditTime: 2021-04-22 17:47:12
 * @LastEditors: zpl
 */
import Schema from './schema.js'

// 设置路由前缀
export const autoPrefix = '/auth'

export default async function auth(fastify, opts) {
  const {
    httpErrors,
    jwt,
    config,
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

      const user = fastify.mysql_edu_platform.models.User;
      let usr = await user.getUsernameAndPassword(req.body.username, req.body.password, config.HMAC_KEY)
      console.log(usr);
      if (usr != null) {
        const token = jwt.sign({ userId: usr.id, userName: usr.username })
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

  fastify.route({
    method: 'POST',
    url: '/outLogin',
    schema: schema.outLogin,
    handler: async (req, res) => {
      res.clearCookie('edu_platform', { path: '/' })
      return {
        status: 'ok',
      }
    }
  })
}