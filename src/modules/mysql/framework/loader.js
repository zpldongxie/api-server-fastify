/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-29 22:16:11
 * @LastEditTime: 2020-07-30 00:37:33
 * @LastEditors: zpl
 */

const fs = require('fs');
const path = require('path');


/**
 * 按指定位置读取model文件
 *
 * @param {*} dir
 * @param {*} cb
 */
function load(dir, cb) {
  const url = path.resolve(__dirname, dir);
  const files = fs.readdirSync(url);
  files.forEach((filename) => {
    // 去掉后缀
    filename = filename.replace('.js', '');
    // 加载
    const file = require(url + '/' + filename);
    // 回调
    cb(filename, file);
  });
}

/**
 *  读取models中的文件，并自动挂载到服务中
 *
 * @param {*} sequelize
 */
const loadModel = (sequelize) => {
  // init
  load('../models', (filename, Model) => {
    typeof Model.initNow === 'function' && Model.initNow(sequelize);
  });
  // 关系映射
  load('../models', (filename, Model) => {
    typeof Model.reateAssociation === 'function' && Model.reateAssociation(sequelize);
  });
};

module.exports = {loadModel};
