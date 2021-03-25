# api-server-fastify
## 基于fastify实现的RESTful API服务

## 业务说明
### 1. 上传文件结构设计
- 建议上传的文件入在一个静态网站中，可以利用CDN进行访问加速。当然使用图床等专业平台效果更佳。
- 为方便浏览及管理，文档结构文件夹使用中文件名称。所有文件与数据库有对应关系，所以为只读，需要进行操作时，必须通过业务系统进行。
- 上传文件夹中在根目录按服务类别创建文件夹。
- 每个类别中包含一个cerTemplat文件夹用来保存证书模板。
- 每个类别中包含一个cer文件，以省份进行分类，保存所有单位获取到的证书，文件名以单位名称+证书生成日期的形式保存。
- 每个类别中以单位名称 -> 申请日期 -> 申请材料 的方式保存每次申请的文件。
```hash
# 保存示例
root
  |
  ├─ 安全咨询
  |     |
  |     ├─ cerTemplat
  |     |
  |     ├─ cer
  |     |    |
  |     |    ├─ 陕西省
  |     |    |    |
  |     |    |    ├─ 申请单位一_20201111.png
  |     |    |    |
  |     |    |    ├─ ...更多文件
  |     |    |
  |     |    ├─ ...更多地区
  |     |
  |     ├─ 申请单位一
  |     |    |
  |     |    ├─ 20200520
  |     |    |     |
  |     |    |     ├─ 固定办公场所证明材料
  |     |    |     |     |
  |     |    |     |     ├─ 文件1
  |     |    |     |     |
  |     |    |     |     ├─ ...文件n
  |     |    |     |
  |     |    |     ├─ ...其他材料
  |     |    |
  |     |    ├─ ...其他时间
  |     |
  |     ├─ ...其他申请单位
  |
  └─ ...其他类别同上
```

## 关于数据库
本系统使用mysql，对应的操作库为sequelize和mysql2
### 创建一个表的步骤
- 在mysql -> models下创建model文件
- mysql -> framework 下的loader.js 实现了自动读取models信息并挂载到服务中，每次系统启动时mysql -> index.js会实时进行调用读取
- 每次启动项目，会根据环境变量配置决定是否自动向mysql数据库创建表格
```bash
# 配置文件 config/default.yaml
  # 同步模型到数据库
  needCreatTable: false
  # 同步前清空所有旧表
  dropOldTable: false
```
- mysql -> init-data 实现了数据初始化功能，当前以部门表是否有数据为判断是否需要初始化数据的参考

## 关于接口
### 接口定义步骤
- 定义了针对所有model的通用api模板
- 通过CLI工具自动生成标准route文件，有特殊业务场景的可在生成的标准文件中进行修改
- 所有参数验证在route文件中结合schema完成
```js
// 参数验证
const validate = ajv.compile(queryListSchema.body.valueOf());
const valid = validate(request.body);
if (!valid) {
  return reply.code(400).send(validate.errors);
}
```
- routes -> util.js 实现了面向业务操作的基本封装以及统一应答设定，由route文件进行调用
### 本系统使用fastify-swagger自动生成api文档
api文档地址：
[http://{ip}:4000/documentation/static/index.html](http://139.186.165.200:3000/documentation/static/index.html)

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
