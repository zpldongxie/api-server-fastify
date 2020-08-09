/*
 * @description:通用工具
 * @author: zpl
 * @Date: 2020-07-28 19:22:01
 * @LastEditTime: 2020-08-09 15:34:37
 * @LastEditors: zpl
 */

/**
 * 统一正常响应处理
 *
 * @param {*} {reply, data=null, msg='请求成功'}
 * @return {*}
 */
exports.onRouterSuccess = ({ reply, data = null, msg = '请求成功' }) => {
  return reply.code(200).send({
    code: 0,
    data,
    msg,
  });
};

/**
 * 统一异常响应处理
 *
 * @param {*} err
 * @param {*} reply
 * @return {*}
 */
exports.onRouteError = (err, reply) => {
  console.log('====================================');
  console.debug(err);
  console.log('====================================');
  // const status = err.status || 500;
  // const error = status === 500 ?
  //   'Internal Server Error' :
  //   err.message;
  // const resBody = {
  //   code: status,
  //   error,
  // };
  // return reply.code(200).send(resBody);
  const { errors } = err;
  if (errors && errors.length) {
    const { message } = errors[0];
    return reply.code(422).send(message);
  }
  return reply.code(500).send(err);
};
