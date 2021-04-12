# Sequelize Models

使用 ES6 classes.

模型扩展了 Sequelize 的 Model 类，我们在模型中创建一个`init`静态方法进行初始化。

参见 [4.0 Model definition syntax](https://github.com/sequelize/sequelize/issues/6524)

尝试将模式代码与模型代码分开，以使其更容易从我们的 fastify 路由中进行访问，从而使验证成为可能。

示例：

```js
//In ./models/schemas/user.js
module.exports.publicSchema = {
  email: { type: "string" },
  username: { type: "string" },
  name: { type: "string" },
  lastname: { type: "string" },
  createdAt: { type: "string" },
};
```

```js
//In our route controller
const { privateSchema, publicSchema } = require('./models/schemas/user')
fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: publicSchema
                    }
                }
            }
        },
        ...
```
