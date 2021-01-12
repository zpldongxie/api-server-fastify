/*
 * @description: 上传功能
 * @author: zpl
 * @Date: 2020-10-13 17:39:11
 * @LastEditTime: 2021-01-12 17:28:48
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const fs = require('fs');
const path = require('path');
const multer = require('fastify-multer');
const dayjs = require('dayjs');

const { commonCatch, onRouterSuccess, onRouterError } = require('../util');
const { viewList, removeFile } = require('../file_manager');

/**
 * 上传配置
 *
 * @param {*} config 路由带过来的配置，用于获取全局配置
 * @param {*} getSysConfig 实时获取系统配置的方法
 * @return {*}
 */
const getPreHandler = (config, getSysConfig) => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const rootPath = config.get('uploadRootPath') || '/tmp/my-uploads/';
      const subPath = `${rootPath}${file.fieldname}/`;
      const targetDirPath = `${subPath}/${dayjs().format('YYYYMM')}/`;
      // 文件夹不存在则创建
      if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath);
        console.log('The ' + rootPath + ' folder has been created!');
      }
      if (!fs.existsSync(subPath)) {
        fs.mkdirSync(subPath);
        console.log('The ' + subPath + ' folder has been created!');
      }
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath);
        console.log('The ' + targetDirPath + ' folder has been created!');
      }
      cb(null, targetDirPath);
    },
    filename: function(req, file, cb) {
      const index = file.originalname.lastIndexOf('.');
      const currentName = index < 0 ? file.originalname : file.originalname.substr(0, index);
      const currentExt = index < 0 ? null : file.originalname.substr(index + 1);
      const saveName = `${currentName}-${Date.now()}${currentExt ? '.' + currentExt : ''}`;
      req.body.saveName = saveName;
      console.log('upload file: ', saveName);
      cb(null, saveName);
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fields: 5,
      fileSize: 100 * 1024 * 1024, // 单个文件大小上限为100M
      files: 20,
      parts: 40,
    },
    fileFilter: async (req, file, cb) => {
      // 获取并解析配置
      const sysConfig = await getSysConfig();
      const extList = sysConfig[`${file.fieldname}_ext`] ? sysConfig[`${file.fieldname}_ext`].split(',') : [];
      const size = sysConfig[`${file.fieldname}_size`] ? sysConfig[`${file.fieldname}_size`] : 0;
      const baseUrl = sysConfig.base_url;
      // 上传文件的扩展名
      const tempArr = file.originalname.split('.');
      currentExt = tempArr.length ? tempArr[tempArr.length - 1] : null;
      if (!extList.length) {
        // 未找到对应类型的配置
        cb(new Error('上传类型错误'));
      } else if (!extList.find((ext) => ext === currentExt)) {
        cb(new Error('文件格式不正确'));
      } else if ((req.headers['content-length']-210) > (size * 1024)) {
        console.log('source size: ' + (req.headers['content-length']-210));
        console.log(size * 1024);
        cb(new Error('文件大小超过限制'));
      } else {
        req.body.url = `${baseUrl}uploads/${file.fieldname}/${dayjs().format('YYYYMM')}/`;
        cb(null, true);
      }
    },
  });

  const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'other', maxCount: 1 },
  ]);

  return cpUpload;
};

// 入口
module.exports = fp(async (server, opts, next) => {
  server.register(multer.contentParser);
  const { ajv } = opts;
  const mysqlModel = server.mysql.models;
  const { SysConfig } = mysqlModel;

  /**
   * 获取系统配置，内部方法
   *
   * @return {*}
   */
  const getSysConfig = async () => {
    const configList = await SysConfig.findAll();
    const config = {};
    configList.forEach((conf) => {
      config[conf.name] = conf.value;
    });
    return config;
  };

  // 上传
  server.route({
    method: 'POST',
    url: '/api/upload',
    preHandler: getPreHandler(opts.config, getSysConfig),
    handler: function(request, reply) {
      // 上传成功后可从request.files中读取文件信息，以便进行后续操作
      // 如果还传递了其他参数，可从request.body中读取
      console.log();
      const { url, saveName } = request.body;
      reply.code(200).send(url + saveName);
    },
  });

  // 查看
  const showFileListSchema = require('./show-file-list-schema');
  server.post(
      '/api/showFileList',
      { schema: { ...showFileListSchema, tags: ['文件管理'], summary: '查看相对路径下的文件列表' } },
      async (request, reply) => {
        const validate = ajv.compile(showFileListSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const runFun = async () => {
          const { currentPath } = request.body;
          const sysConfig = await getSysConfig();
          const baseUrl = sysConfig.base_url;
          const absPath = path.resolve(opts.config.get('uploadRootPath'), currentPath);
          const list = viewList(absPath);
          list.forEach((f) => {
            f.url = `${baseUrl}uploads/${currentPath}/${f.name}`;
          });
          onRouterSuccess(reply, list);
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );

  // 删除
  const deleteSchema = require('./delete-schema');
  server.delete(
      '/api/file',
      { schema: { ...deleteSchema, tags: ['文件管理'], summary: '删除文件' } },
      async (request, reply) => {
        const validate = ajv.compile(deleteSchema.body.valueOf());
        const valid = validate(request.body);
        if (!valid) {
          return reply.code(400).send(validate.errors);
        }

        const runFun = async () => {
          const { filePath, fileName } = request.body;
          const tempPath = `${filePath}/${fileName}`;
          const absPath = path.resolve(opts.config.get('uploadRootPath'), tempPath);
          removeFile(
              absPath,
              () => {
                onRouterSuccess(reply);
              },
              (err) => {
                console.error(err);
                onRouterError(reply, { status: 200 });
              },
          );
        };

        // 统一捕获异常
        commonCatch(runFun, reply)();
      },
  );
});
