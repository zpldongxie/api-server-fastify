# 基于fastify + typescript实现的RESTful API服务

## 依赖包说明

### 开发依赖

```js
"devDependencies": {
    "@types/jest": "^26.0.5",
    "@types/node": "^14.0.24",
    "@typescript-eslint/eslint-plugin": "^3.7.0",
    "@typescript-eslint/parser": "^3.7.0",
    "eslint": "^7.5.0",
    "eslint-config-airbnb-base": "^14.2.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.22.0",
    "jest": "^26.1.0",
    "source-map-support": "^0.5.19",  // build部署使用
    "ts-jest": "^26.1.3",
    "ts-node": "^8.10.2",
    "typescript": "^3.9.7"
  }
```

### 运行依赖

```js
"dependencies": {
    "config": "^3.3.1",
    "fastify": "^3.1.1",
    "fastify-blipp": "^3.0.0",
    "fastify-plugin": "^2.0.1"
  }
```

## eslint配置

```js
{
  "env": {
    "es2020": true,
    "node": true
  },
  "extends": ["google", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "linebreak-style": [0, "error", "windows"]
  }
}
```

