/*
 * @description:
 * @author: zpl
 * @Date: 2020-07-29 22:16:11
 * @LastEditTime: 2021-02-25 15:22:21
 * @LastEditors: zpl
 */

const fs = require('fs');
const path = require('path');
const { env } = require('process');
const { load } = require('../../../util');

/**
 *  读取models中的文件，并自动挂载到服务中
 *
 * @param {*} sequelize
 * @param {*} needCreatTable
 * @param {*} dropOldTable
 * @param {*} database
 */
const loadModel = async (sequelize, needCreatTable, dropOldTable, database) => {
  const initFunList = [];
  const reateAssociationList = [];
  const url = path.resolve(__dirname, '../models');
  load(url, (filename, Model) => {
    typeof Model.initNow === 'function' && initFunList.push(Model.initNow);
    typeof Model.reateAssociation === 'function' && reateAssociationList.push(Model.reateAssociation);
  });

  // init
  for (let i = 0; i < initFunList.length; i++) {
    const initFun = initFunList[i];
    await initFun(sequelize);
  }
  // 关系映射
  for (let i = 0; i < reateAssociationList.length; i++) {
    const reateAssociation = reateAssociationList[i];
    await reateAssociation(sequelize);
  }
  // 根据模型创建表
  if (needCreatTable) {
    console.log('===============数据库表创建开始===============');
    if (dropOldTable) {
      await sequelize.drop();
      console.log('所有表已删除!');
    }
    await sequelize.sync({ match: new RegExp('^' + database + '$') });
    console.log('===============数据库表创建结束===============');
  }
};

const buildRoute = async (models) => {
  // 路由文件根目录
  const root = path.join(env.PWD || env.INIT_CWD, './src/routes');
  // 读取模板文件
  const templateRoot = path.join(env.PWD || env.INIT_CWD, './src/routes/template');
  const templates = [];
  load(templateRoot, (name, _) => {
    templates.push({
      name: name === 'template' ? 'index.js' : `${name}.js`,
      template: fs.readFileSync(path.join(env.PWD || env.INIT_CWD, `./src/routes/template/${name}.js`), 'utf8'),
    });
  });

  // 例外，不自动生成文件的model
  const exception = [
    'DepartmentUser',
    'ChannelAtricle',
    'ServiceTypeEvaReq',
  ];

  // 遍历modules
  Object.keys(models)
      .filter((name) => !exception.includes(name))
      .map((modelName) => {
        const targetDirPath = path.join(root, `./${modelName.toLowerCase()}`);

        // 文件夹不存在则创建
        if (!fs.existsSync(targetDirPath)) {
          fs.mkdirSync(targetDirPath);
          console.log('The ' + targetDirPath + ' folder has been created!');
        }

        templates.forEach((item) => {
          const targetFilePath = path.join(targetDirPath, item.name);
          // 创建文件
          if (!fs.existsSync(targetFilePath)) {
            const content = item.template
                .replace(/CurrentModelName/g, modelName)
                .replace(/currentModelName/g, modelName.toLowerCase());
            fs.writeFile(targetFilePath, content, (err) => {
              if (err) throw err;
              console.log('The ' + targetFilePath + ' has been created!');
            });
          } else {
          // console.log(targetFilePath + ' has already been existed!');
          }
        });
      });
};

module.exports = { loadModel, buildRoute };
