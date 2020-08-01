/*
 * @description:通用工具
 * @author: zpl
 * @Date: 2020-07-28 19:22:01
 * @LastEditTime: 2020-08-01 14:47:20
 * @LastEditors: zpl
 */

exports.onRouteError = (error, reply) => {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
  const {errors} = error;
  if (errors && errors.length) {
    const {message} = errors[0];
    return reply.code(406).send(message);
  }
  return reply.code(500).send(error);
};
