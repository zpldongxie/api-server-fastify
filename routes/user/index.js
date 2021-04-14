/*
* @description: 用户路由
* @author: zpl
* @Date: 2021-04-10 13:45:03
 * @LastEditTime: 2021-04-12 17:07:52
 * @LastEditors: zpl
*/
import S from 'fluent-json-schema'
import Schema from './schema.js'

export const autoPrefix = '/user'

export default async function user(fastify, opts) {
  const schema = new Schema(fastify);
  const {
    httpErrors,
    elastic,
    indices,
    jwt_auth,
    csrfProtection
  } = fastify

  // Every route inside this plugin should be protected by our authorization logic. 
  // The easiest way to do it, is by adding an hook that runs our authorization code.
  // You should always run your authorization as soon as possible in the request/response lifecycle!
  fastify.addHook('onRequest', jwt_auth)

  // The frontend needs the CSRF token to be able to
  // communicate with the others API. This route returns
  // a token for every authenticated request.
  fastify.route({
    method: 'GET',
    path: '/refresh',
    schema: {
      tags: ['user'],
      operationId: 'getUserRefresh',
      description: 'Route used by the frontend app to validate the session' +
        ' and retrieve the CSRF token.',
      response: {
        200: S.object().prop('csrfToken', S.string())
      }
    },
    handler: onRefresh
  })

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['user'],
      operationId: 'getAllUser',
      summary: '查询所有用户',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'CurrentUser#' }
        }
      }
    },
    handler: async (req, res) => {
      /**@type {User}*/
      const user = fastify.mysql_basis.models.User;
      /**@type {User[]}*/
      let usrs = await user.findAll();
      usrs = usrs.map((usr) => {
        return usr.toJSON();
      })
      return usrs;
    }
  });

  async function onRefresh(req, reply) {
    // `.generateCsrf` is a decorator added by `fastify-csrf`
    // It adds an additional cookie to the response with the csrf secret, it returns the csrf token.
    // Don't know what CSRF is? Take a look at https://github.com/pillarjs/understanding-csrf.
    const csrfToken = await reply.generateCsrf()
    return { csrfToken }
  }

  fastify.route({
    method: 'GET',
    path: '/currentUser',
    schema: schema.currentUser,
    handler: async (req, res) => {
      console.log(req.user);
      const {User} = fastify.mysql_basis.models;
      const user = await User.getById(req.user.userId);
      if (!user) {
        throw httpErrors.internalServerError('用户信息查询失败')
      }
      const usr = user.toJSON();
      return { ...usr, name: usr.username }
      // return {
      //   name: 'Serati Ma',
      //   username: 'Serati Ma',
      //   avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      //   userid: '00000001',
      //   nombre: 'a',
      //   apellidos: 'b',
      //   createdAt: '123',
      //   email: 'antdesign@alipay.com',
      //   signature: '海纳百川，有容乃大',
      //   title: '交互专家',
      //   group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      //   tags: [
      //     {
      //       key: '0',
      //       label: '很有想法的',
      //     },
      //     {
      //       key: '1',
      //       label: '专注设计',
      //     },
      //     {
      //       key: '2',
      //       label: '辣~',
      //     },
      //     {
      //       key: '3',
      //       label: '大长腿',
      //     },
      //     {
      //       key: '4',
      //       label: '川妹子',
      //     },
      //     {
      //       key: '5',
      //       label: '海纳百川',
      //     },
      //   ],
      //   notifyCount: 12,
      //   unreadCount: 11,
      //   country: 'China',
      //   access: 'admin',
      //   geographic: {
      //     province: {
      //       label: '浙江省',
      //       key: '330000',
      //     },
      //     city: {
      //       label: '杭州市',
      //       key: '330100',
      //     },
      //   },
      //   address: '西湖区工专路 77 号',
      //   phone: '0752-268888888',
      // };
    }
  })
}