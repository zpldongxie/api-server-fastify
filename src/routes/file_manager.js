/*
 * @Description: 文件操作类
 * @Author: zpl
 * @Date: 2019-06-20 11:37:44
 * @LastEditors: zpl
 * @LastEditTime: 2020-10-18 19:45:22
 */
const fs = require('fs');

/**
 * 查看指定文件夹下的文件列表
 *
 * @param {*} path
 * @return {*}
 */
const viewList = (path) => {
  try {
    const files = fs.readdirSync(path, { withFileTypes: true });
    const list = files.map((file) => {
      return {
        name: file.name,
        type: file.isDirectory() ? 'dir' : 'file',
      };
    });
    return list;
  } catch (e) {
    console.log('------读取文件错误------', e);
    return [];
  }
};

/**
 * 复制文件
 *
 * @param {String} src 原始路径
 * @param {String} dest 目标路径
 * @param {Function} onSuccess 成功回调
 * @param {Function} onError 失败回调
 */
const copyFile = (src, dest, onSuccess, onError) => {
  fs.copyFile(src, dest, (err) => {
    if (err) {
      onError && typeof onError === 'function' && onError(err);
    } else {
      onSuccess && typeof onSuccess === 'function' && onSuccess();
    }
  });
};

/**
 * 删除文件
 *
 * @param {String} path 路径
 * @param {Function} onSuccess 成功回调
 * @param {Function} onError 失败回调
 */
const removeFile = (path, onSuccess, onError) => {
  fs.unlink(path, (err) => {
    if (err) {
      onError && typeof onError === 'function' && onError(err);
    } else {
      onSuccess && typeof onSuccess === 'function' && onSuccess();
    }
  });
};

/**
 * 移动文件
 *
 * @param {String} src 原始路径
 * @param {String} dest 目标路径
 * @param {Function} onSuccess 成功回调
 * @param {Function} onError 失败回调
 * @param {Boolean} checkRemove 是否检查删除结果
 */
const moveFile = (src, dest, onSuccess, onError, checkRemove) => {
  copyFile(
      src,
      dest,
      () => {
        removeFile(src, onSuccess, (err) => {
          if (checkRemove && err) {
            onError && typeof onError === 'function' && onError(err);
          } else {
            onSuccess && typeof onSuccess === 'function' && onSuccess();
          }
        });
      },
      (err) => {
        onError && typeof onError === 'function' && onError(err);
      },
  );
};

module.exports = {
  viewList: viewList,
  copyFile: copyFile,
  removeFile: removeFile,
  moveFile: moveFile,
};
