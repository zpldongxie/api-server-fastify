# api-server-fastify
## 基于fastify实现的RESTful API服务

## 关于数据库
本系统使用mysql，对应的操作库为sequelize和mysql2
### 创建一个表的步骤
- 在mysql -> models下创建model文件
- mysql -> framework 下的loader.js 实现了自动读取models信息并挂载到服务中，每次系统启动时mysql -> index.js会实时进行调用读取
```js
await loadModel(sequelize);
```
- 每次启动项目，会根据环境变量配置决定是否自动向mysql数据库创建表格
```js
if (needCreatTable) {
  await checkTablesExists(database, models);
}
```
- mysql -> init-data 实现了数据初始化功能，当前以用户分组表是否有数据为判断是否需要初始化数据的参考
```js
if (userGroups && userGroups.length) return ['无需初始化'];
console.log('-----------------------------------------------');
console.log('---------------初始化数据库 开始---------------');
console.log('-----------------------------------------------');

console.log('1. 初始化用户组...');
returnResult = returnResult.concat(await initUserGroup(UserGroup, userGroupList));
console.log('2. 初始化用户...');
returnResult = returnResult.concat(await initUser(UserGroup, User, userList));
console.log('3. 初始化会员类型...');
returnResult = returnResult.concat(await initMemberType(MemberType, memberTypeList));

console.log('-----------------------------------------------');
console.log('---------------初始化数据库 结束---------------');
console.log('-----------------------------------------------');
```
- mysql -> dao.js 对面向数据的基本操作进行的封装

## 关于接口
### 接口定义步骤
- 定义了针对所有model的通用api模板
- 通过CLI工具自动生成标准route文件，有特殊业务场景的可在生成的标准文件中进行修改
- 所有参数验证在route文件中结合schema完成
```js
const validate = ajv.compile(queryListSchema.body.valueOf());
const valid = validate(request.body);
if (!valid) {
  return reply.code(400).send(validate.errors);
}
```
- routes -> util.js 实现了面向业务操作的基本封装以及统一应答设定，由route文件进行调用
### 本系统使用fastify-swagger自动生成api文档
api文档地址：
[http://49.234.158.74:3000/documentation/static/index.html](http://49.234.158.74:3000/documentation/static/index.html)

## 其他实现
### 1. 上传下载使用fastify-multer插件
配置方法
- 在项目config中配置上传的物理路径，建议先手动创建uploads/文件夹，再配置具体路径
- 此时可以正常进行上传
- 在管理平台上传配置中设置访问域名，例如 http://www.baidu.com/，建议以 / 结尾
- 资源管理功能中会默认域名对应配置的物理路径，且上传文件夹是以静态资源进行访问
- 例如磁盘中/uploads/image/aaa.png 对应的访问地址就是 ip:port/uploads/image/aaa.png

### 2. 一行命令查找服务进程并kill掉
首次使用先用ps命令确认node和项目脚本的执行信息
```bash
ps -ef|grep /root/.nvm/versions/node/v10.16.3/bin/node |grep ./src/index.js  | grep  -v grep  | awk '{print $2}' | xargs kill -9
```
