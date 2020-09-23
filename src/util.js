/*
 * @description: 全局工具
 * @author: zpl
 * @Date: 2020-09-07 00:38:53
 * @LastEditTime: 2020-09-18 18:21:33
 * @LastEditors: zpl
 */
const path = require('path');
const fs = require('fs');
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

module.exports = {
  load,
  convertChannelsToTree,
};
