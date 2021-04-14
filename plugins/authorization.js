/*
 * @description: OAthor2认证配置，暂未生效
 * @author: zpl
 * @Date: 2021-04-10 10:47:54
 * @LastEditTime: 2021-04-12 12:29:18
 * @LastEditors: zpl
 */
import fp from 'fastify-plugin'

async function authorization (fastify, opts) {
  const { httpErrors, config } = fastify
  const testUser = config.TEST_USER

  fastify.decorate('authorize', authorize)
  fastify.decorate('isUserAllowed', opts.testing ? isUserAllowedMock : isUserAllowed)
  // fastify.decorateRequest('user', null)

  // If the cookie is present it will try to unsign it and finally
  // verify with the OAuth provider if the provided token is valid
  // and is part of the allowed users list.
  // If the user is accepeted, it will update the `request.user` property
  // with the mail address of the user.
  async function authorize (req, reply) {
    const { user_session } = req.cookies
    if (!user_session) {
      throw httpErrors.unauthorized('Missing session cookie')
    }

    const cookie = req.unsignCookie(user_session)
    if (!cookie.valid) {
      throw httpErrors.unauthorized('Invalid cookie signature')
    }

    console.log('cookie', cookie);
    req.log.warn(`cookie: ${cookie}`)

    let mail
    try {
      mail = await fastify.isUserAllowed(cookie.value)
    } catch (err) {
      req.log.warn(`Invalid user tried to authenticate: ${JSON.stringify(err.user)}`)
      // Let's clear the cookie as well in case of errors
      reply.clearCookie('user_session', { path: '/_app' })
      throw err
    }

    // You can add any property to the request/reply objects,
    // but it's important you declare them in advance with decorators.
    // If you don't, your code will likely be deoptimized by V8.
    req.user = { mail }
  }

  async function isUserAllowed (token) {
    // TODO: 可在此对cookie进行解析，返回的用户信息会被加入req中进入下一步业务逻辑
    console.log('token', token);
    return token;
  }

  // Mocks are double edges swords. The main issue with mocks
  // is that usually you only test for the success case.
  // You should test for the bad case as well, so if you are
  // writing a mock be sure to handle the failure cases as well.
  async function isUserAllowedMock (token) {
    if (token === 'invalid') {
      throw httpErrors.forbidden('You are not allowed to access this')
    }
    return testUser
  }
}

// When exporting a plugin that exposes a utility that will need to be used in other parts of your application, use `fastify-plugin` to tell Fastify that
// this plugin should not be encapsulated. See https://www.fastify.io/docs/latest/Encapsulation/.
export default fp(authorization, {
  // Protip: if you name your plugins, the stack trace in case of errors
  //         will be easier to read and other plugins can declare their dependency
  //         on this one. `fastify-autoload` will take care of loading the plugins
  //         in the correct order.
  name: 'authorization'
})
