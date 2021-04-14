/*
 * @description: jwt认证配置
 * @author: zpl
 * @Date: 2021-04-10 15:18:18
 * @LastEditTime: 2021-04-12 13:53:26
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'
import jwt from 'fastify-jwt'

async function jwt_auth (fastify, opts) {
  const { httpErrors, config } = fastify

  fastify.register(jwt, {
    secret: config.COOKIE_SECRET, // 'WW14dlp5NTZhSFZ3Wlc1bmJHbGhibWN1WTI0JTNE',
    sign: {
      expiresIn: '2h',
    },
    verify: {
      maxAge: '2d',
      extractToken: (req) => {
        const { edu_platform } = req.cookies
        return edu_platform;
        // 可支持从请求头部获取验证信息
        // return req.headers.authorization.split('Bearer ')[1];
      },
    },
  })

  try{
    fastify.decorate("jwt_auth", async (request, reply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        throw httpErrors.unauthorized(err)
      }
    })
  }catch(err){}
}

export default fp(jwt_auth, {
  name: 'jwt_auth'
})