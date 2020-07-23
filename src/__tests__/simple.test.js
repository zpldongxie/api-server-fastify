/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-23 12:05:51
 * @LastEditTime: 2020-07-23 12:10:03
 * @LastEditors: zpl
 */
const fastify = require('fastify');

const statusRoutes = require('../modules/routes/status');

describe('/status', () => {
  let server;

  beforeAll(() => {});

  beforeEach(async () => {
    server = fastify({});
    // eslint-disable-next-line global-require
    server.register(statusRoutes);
    await server.ready();

    jest.clearAllMocks();
  });

  it('GET returns 200', async (done) => {
    const response = await server.inject({method: 'GET', url: '/status'});
    expect(response.statusCode).toEqual(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toMatchSnapshot({date: expect.any(String), works: true});

    done();
  });

  it('POST returns 404', async (done) => {
    const response = await server.inject({method: 'POST', url: '/status'});
    expect(response.statusCode).toEqual(404);
    expect(response.payload).toMatchSnapshot();

    done();
  });
});
