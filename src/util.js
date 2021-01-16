/*
 * @description: 全局工具
 * @author: zpl
 * @Date: 2020-09-07 00:38:53
 * @LastEditTime: 2021-01-16 22:23:58
 * @LastEditors: zpl
 */
const path = require('path');
const fs = require('fs');
const localize = require('ajv-i18n');

/**
 * 统一正常响应处理
 *
 * @param {*} reply
 * @param {*} [data=null]
 * @param {string} [message='请求成功']
 * @param {number} [code=200]
 */
const onRouterSuccess = (reply, data = null, message = '请求成功', code = 200) => {
  reply.code(code).send({
    status: 'ok',
    data,
    message,
  });
};

/**
 * 统一异常响应处理
 *
 * @param {*} reply
 * @param {*} err
 */
const onRouterError = (reply, err) => {
  const code = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const resBody = {
    status: 'error',
    message,
  };
  reply.code(code).send(resBody);
};

/**
 * 转换错误信息
 *
 * @param {*} error
 * @return {*}
 */
const convertCatchInfo = (error) => {
  const {
    message,
    original={},
    validation,
  } = error;
  const { sqlMessage } = original;
  const err = {
    status: 200,
  };
  if (typeof error === 'string') {
    // 直接错误描述
    err.message = error;
  } else if (validation) {
    // 数据验证错误
    localize.zh(validation);
    err.message = validation;
  } else if (sqlMessage) {
    // sql错误
    err.message = sqlMessage;
  } else if (message) {
    switch (message) {
      case 'Validation error':
        console.log('进来一个枯怪的分支。。。');
        // 数据验证错误
        err.message = error.errors[0].message;
        break;
      default:
        // 未分类错误
        err.message = message;
    }
  } else {
    // 其他格式错误
    err.message = 'Internal Server Error';
  }
  return err;
};

/**
 * 按指定位置读取model文件
 *
 * @param {*} dir 查找要目录
 * @param {*} cb 回调
 * @param {*} filename 查找的文件名，不传值表示使用全部
 */
function load(dir, cb, filename) {
  const files = fs.readdirSync(dir);
  files.forEach((name) => {
    const fullPath = dir + '/' + name;
    const fileStat = fs.statSync(fullPath);
    if (fileStat.isDirectory()) {
      load(fullPath, cb, filename);
    } else if (path.extname(name) === '.js') {
      if (!filename || (filename && filename === name)) {
        // 去掉后缀
        name = name.replace('.js', '');
        // 加载
        const file = require(dir + '/' + name);
        // 回调
        cb(name, file);
      }
    }
  });
}

/**
 * 转换栏目接口返回数据为组件需要的树型数据结构
 *
 * @param {*} list 原始数据
 * @param {*} channels 目标数据
 * @param {*} parentId 支持递归需要知道挂载到哪个父id上
 */
const convertChannelsToTree = (list, channels, parentId) => {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const channel = list[i];
    if (channel.parentId === parentId) {
      channels.push({
        ...channel,
        children: [],
      });
      list.splice(i, 1);
    }
  }
  if (list.length) {
    channels.forEach((channel) => {
      convertChannelsToTree(list, channel.children, channel.value);
    });
  }
};

/**
 * 获取当前时间
 *
 * @return {*}
 */
const getCurrentDate = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
  return localISOTime;
};

module.exports = {
  onRouterSuccess,
  onRouterError,
  convertCatchInfo,
  load,
  convertChannelsToTree,
  getCurrentDate,
};
