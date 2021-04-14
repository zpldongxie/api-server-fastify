/*
 * @description: 通过参数指定schemas文件夹，自动分析并生成对应的model文件
 * 示例： node .\scripts\build-modelFiles.js .\models\business_basis\schemas\
 * @author: zpl
 * @Date: 2021-04-13 15:04:19
 * @LastEditTime: 2021-04-14 14:17:40
 * @LastEditors: zpl
 */
import fs from 'fs';
import path from 'path';

const myArgs = process.argv.slice(2);

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
      if (!filename || filename === name) {
        // 去掉后缀
        const realName = name.replace('.js', '');
        let absPath = path.join(dir, name);
        if (absPath.match(/^[a-zA-Z]:/)) {
          absPath = 'file://' + absPath;
        }
        // 加载
        import(absPath).then(file => {
          // 回调
          cb(realName, file);
        }).catch(e => {
          console.log(e);
        });
      }
    }
  });
}

function run() {
  if (!myArgs[0] || !myArgs[0].endsWith('schemas\\')) {
    console.error('---请通过参数指定正确的schemas路径---');
    return;
  }
  const dir = path.join(process.cwd(), myArgs[0]);
  if (!fs.existsSync(dir)) {
    console.error('传入的路径无效');
    return;
  }

  // 用于index.js的import语句
  const importList = [];
  // 用于index.js的models声明语句
  const modelList = [];

  // 模板文件
  const template = fs.readFileSync(path.join(dir, '../../modelTemplat'), 'utf8');

  console.log('开始查找schemas');
  load(dir, (realName, file) => {
    const targetFilePath = path.join(dir, '../', `${realName}.js`);
    const json = file.InfoSchema.valueOf();
    importList.push(`import ${json['$id']} from './${realName}.js'`);
    modelList.push(`${json['$id']}: ${json['$id']}.init(sequelize, XXDM)`);

    if (!fs.existsSync(targetFilePath)) {
      console.log('--开始生成--', targetFilePath);
      const time = new Date();
      const year = time.getFullYear();
      const month = `${time.getMonth() < 9 ? '0' : ''}${time.getMonth() + 1}`;
      const day = time.getDate();
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const content = template
        .replace(/%title%/g, json['$id'].toLowerCase())
        .replace(/%title_U%/g, json['$id'])
        .replace(/%title_CN%/g, json.description)
        .replace(/%time%/g, `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
      fs.writeFile(targetFilePath, content, (err) => {
        if (err) throw err;
        console.log('The ' + targetFilePath + ' 已创建!');
      });
    }
  })
  console.log('==================文件创建完成=================');
  setTimeout(() => {
    console.log('importList', importList);
    console.log('modelList', modelList);
  }, 3000);
}

run();