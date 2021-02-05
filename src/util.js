/*
 * @description: 全局工具
 * @author: zpl
 * @Date: 2020-09-07 00:38:53
 * @LastEditTime: 2021-02-04 10:11:11
 * @LastEditors: zpl
 */
const path = require('path');
const fs = require('fs');
const localize = require('ajv-i18n');

const emailHeadImg = require('./assets/emailHeadImg');
const emailFooterLogo = require('./assets/emailFooterLogo');

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

/**
 * 套用标准email模板
 *
 * @param {*} context
 * @return {*}
 */
const getEmailHtml = (context) => {
  return `
  <div style="width: 600px; margin: 10px auto;">
    <div class="header"></div>
    <div class="body">
      <img
        src=${emailHeadImg}
        alt=""
        srcset=""
      />
      <div
        class="con"
        style="
          position: relative;
          background-color: #fff;
          width: 560px;
          margin: -105px auto 0;
          min-height: 300px;
          padding: 40px;
          font-size: 15px;
          line-height: 1.5em;
          box-sizing: border-box;
        "
      >
        ${context}
      </div>
    </div>
    <div
      class="footer"
      style="
        border-top: 2px solid #4c8447;
        border-bottom: 10px solid #4c8447;
        font-size: 14px;
        padding: 20px;
      "
    >
      <div style="display: inline-block; width: 350px; line-height: 1.9em; vertical-align: middle;">
        <div>联系我们</div>
        <div>电话：029-8885-9176</div>
        <div>地址：西安市高新区茶张路一号省信息化中心17层</div>
      </div>
      <div style="display: inline-block; width: 200px; text-align: right; vertical-align: middle;">
        <img src=${emailFooterLogo} alt="" srcset="">
      </div>
    </div>
  </div>
  `;
};

/**
 * 计算插入数据的排序值，可以插到尾部，不可插到头部
 *
 * @param {*} startOrderIndex 前一条记录的排序值，不能为null
 * @param {*} endOrderIndex 后一条记录的排序值，可以为null
 * @return {Number | null} 新序号
 */
const getInsertOrderIndex = (startOrderIndex, endOrderIndex) => {
  console.log('-----getInsertOrderIndex-----');
  /**
   * 获取小数长度
   *
   * @param {*} loanRate
   * @return {*}
   */
  const getFloatLength = (loanRate) => {
    const x = String(loanRate).indexOf('.') + 1; // 小数点的位置
    const y = x ? String(loanRate).length - x : 0; // 小数的位数
    return y;
  };
  /**
   * 判断两数是否连续
   *
   * @param {*} x
   * @param {*} y
   * @return {*}
   */
  const isSuccessive = (x, y) => {
    const xLength = getFloatLength(x);
    const yLength = getFloatLength(y);
    const maxLength = xLength > yLength ? xLength : yLength;
    const xNum = x * Math.pow(10, maxLength);
    const yNum = y * Math.pow(10, maxLength);
    if (Math.abs(xNum - yNum) === 1) {
      return true;
    }
    return false;
  };

  // 不能向前面插入
  if (typeof startOrderIndex === 'undefined' || startOrderIndex === null) {
    return null;
  }
  // 插入到最后面
  if (endOrderIndex === null) {
    return Math.ceil(startOrderIndex + 10);
  }
  let newIndex = (startOrderIndex + endOrderIndex) / 2;
  const newLength = getFloatLength(newIndex);
  const startLength = getFloatLength(startOrderIndex);
  const endLength = getFloatLength(endOrderIndex);
  // 前后序号不相邻且新序号位数变长则进位
  if (!isSuccessive(startOrderIndex, endOrderIndex) && newLength > startLength && newLength > endLength) {
    newIndex = Math.round(newIndex * Math.pow(10, newLength-1)) / Math.pow(10, newLength-1);
  }

  return newIndex;
};

module.exports = {
  onRouterSuccess,
  onRouterError,
  convertCatchInfo,
  load,
  convertChannelsToTree,
  getCurrentDate,
  getEmailHtml,
  getInsertOrderIndex,
};
