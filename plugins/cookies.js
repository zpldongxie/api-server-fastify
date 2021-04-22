/*
 * @description: cookies
 * @author: zpl
 * @Date: 2021-04-12 12:25:52
 * @LastEditTime: 2021-04-22 15:50:42
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'
import Cookie from 'fastify-cookie'
import Csrf from 'fastify-csrf'

async function cookiesPlugin (fastify, opts) {
  const { config } = fastify

  // `fastify-cookie` adds everything you need to work with cookies
  fastify.register(Cookie, {
    secret: config.COOKIE_SECRET
  })

  // When using sessions with cookies, it's always recommended to use CSRF.
  // `fastify-csrf` will help you better protect your application.
  // Don't know what CSRF is? Take a look at https://github.com/pillarjs/understanding-csrf.
  fastify.register(Csrf, {
    sessionPlugin: 'fastify-cookie',
    cookieOpts: { 
      signed: true,
      httpOnly: true,
    }
  })
}

export default fp(cookiesPlugin, {
  name: 'cookiesPlugin'
})
