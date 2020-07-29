/*
 * @description:通用工具
 * @author: zpl
 * @Date: 2020-07-28 19:22:01
 * @LastEditTime: 2020-07-28 19:24:04
 * @LastEditors: zpl
 */

exports.onRouteError = (error, reply) => {
  const {errors} = error;
  if (errors && errors.length) {
    const {message} = errors[0];
    return reply.code(406).send(message);
  }
  return reply.code(500).send(error);
};
