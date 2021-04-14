# 智慧教育平台API服务
项目地址：[]()
## 系统说明
- 本系统为纯API服务，无UI界面
### 启动项目
1. 请先配置env环境变量
  - XXDM 学校代码
  - NODE_ENV node环境变量
  - COOKIE_SECRET cookie和jwt都使用此密钥
  - HMAC_KEY 用户密码加密key
  - UPLOAD_ROOT_PATH 文件上传根路径
2. npm run dev 开发模式
3. npm start 生产模式
### TODO
- swagger转openAPI后，components下schemas名称不准确的问题
  - fastify-swagger引用的json-schema-resolver包需要优化，官方已有[问题跟踪](https://github.com/Eomm/json-schema-resolver/pull/4)
  - 先修改[源码](node_modules/json-schema-resolver/ref-resolver.js)140行进行规避
  ```js
  json[kRefToDef] = `def-${rolling++}`
  // 修改为
  json[kRefToDef] = id || `def-${rolling++}`
  ```
### 代码结构
```hash
root
  ├─ models       # 数据库模型
  |     ├─ business_basis           # 基础教育数据库
  |     |    ├─ initData            # 初始数据
  |     |    ├─ schemas             # 模型定义
  |     |    ├─ index.js            # 统一加载所有model
  |     |    ├─ README.md           # 说明文档
  |     |    ├─ user.js             # 模型方法实现-用户，其他依此类推
  |     |
  |     └─ dictionary               # 字典数据库，结构同上
  |
  ├─ plugins       # 插件
  |     ├─ authorization.js         # OAthor2认证配置，暂未生效
  |     ├─ jwt.js                   # jwt认证
  |     ├─ mysql_business_basis.js  # 基础教育数据库模型挂载及同步
  |     ├─ mysql_dictionary.js      # 字典数据库模型挂载及同步
  |     ├─ swagger.js               # swagger路由映射
  |     └─ util.js                  # 定义一此通用的工具及方法
  |
  ├─ routes        # 路由
  |     ├─ auth                     # 认证相关路由
  |     ├─ status.js                # 系统状态路由
  |     ├─ README.md                # 路由实现说明及开发建议
  |     ├─ user                     # 用户相关路由，其他依此类推
  |
  ├─ script        # 需要用到，但不影响项目的脚本
  |     ├─ build-modelFiles.js      # 自动生成model文件
  |     ├─ keys-generator.js        # 生成42位长度的base64字符串
  |
  ├─ test          # 测试脚本，后期再实现
  |
  ├─ .env          # 系统变量配置
  ├─ app.js        # 应用入口
  ├─ configure_dev.js           # 开发环境配置
  ├─ configure_production.js    # 生产环境配置
  └─ server.js                  # 不使用cli时，请直接以此文件为入口，使用npm执行
```
### 技术参考

|                            nodejs                            |                           fastify                            |                           swagger                            |                          sequelize                           |                            mysql                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <a href="https://nodejs.org/zh-cn/" target="_blank"><img src="https://nodejs.org/static/images/logo.svg" height="40" /></a> | <a href="https://www.fastify.io/" target="_blank"><img src="https://www.fastify.io/images/fastify-logo-menu.d13f8da7a965c800.png" height="40" /></a> | <a href="https://swagger.io/" target="_blank"><img src="https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg" height="40" /></a> | <a href="https://sequelize.org/" target="_blank"><img src="https://sequelize.org/master/image/brand_logo.png" height="40" /></a> | <a href="https://www.mysql.com/" target="_blank"><img src="https://labs.mysql.com/common/logos/mysql-logo.svg?v2" height="40" /></a> |

<br />

### 项目参考
<div>
  <span style="display: inline-block; padding: 0 10px;"><a href="https://github.com/delvedor/fastify-example#readme">fastify-example</a></span>
  <span style="display: inline-block; padding: 0 10px;"><a href="https://github.com/SecSamDev/fastify-starter-kit">fastify-starter-kit</a></span>
</div>

<br />

## 关于接口
### 本系统使用fastify-swagger自动生成api文档
api文档地址：
http://{ip}:{port}/documentation/static/index.html

## 其他实现
### 1. 上传下载使用fastify-multer插件
配置方法
- 在项目config中配置上传的物理路径，建议先手动创建uploads/文件夹，再配置具体路径
- 此时可以正常进行上传
- 在管理平台上传配置中设置访问域名，例如 http://www.baidu.com/，建议以 / 结尾
- 资源管理功能中会默认域名对应配置的物理路径，且上传文件夹是以静态资源进行访问
- 例如磁盘中/uploads/image/aaa.png 对应的访问地址就是 ip:port/uploads/image/aaa.png
