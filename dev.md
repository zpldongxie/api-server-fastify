# 基于fastify实现的RESTful API服务

## 依赖包说明

### 开发依赖

```js
"devDependencies": {
    "cross-env": "^7.0.2",
    "eslint": "^7.5.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.22.0",
    "jest": "^26.1.0",
    "nodemon": "^2.0.4",
    "source-map-support": "^0.5.19"
  }
```

### 运行依赖

```js
"dependencies": {
    "config": "^3.3.1",
    "fastify": "^3.1.1",
    "fastify-blipp": "^3.0.0",
    "fastify-plugin": "^2.0.1",
    "fluent-schema": "^1.0.4",
    "mongoose": "^5.9.25",
    "request": "^2.88.2"
  }
```

## eslint配置

```js
{
    "env": {
        "commonjs": true,
        "es2020": true,
        "node": true
    },
    "extends": [
        "google"
    ],
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
        "linebreak-style": [0, "error", "windows"]
    }
}
```

