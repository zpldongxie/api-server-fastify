/*
 * @description:
 * @author: zpl
 * @Date: 2020-08-07 10:32:25
 * @LastEditTime: 2021-03-16 11:10:54
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');

'use strict';

module.exports = fp(async (server, opts, next) => {
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: '网安联',
        description: '网安服务机构等级评定系统api，仅供内部使用，正式发版本后，此界面禁止查看。',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://github.com/fastify/fastify-swagger',
        description: 'fastify-swagger技术参考',
      },
      // host: '49.234.158.74:3000',
      // schemes: ['http'],
      // consumes: ['application/json'],
      // produces: ['application/json'],
      tags: [
        { name: 'user', description: '用户' },
        { name: 'userextension', description: '用户扩展' },
        { name: 'department', description: '部门' },
        { name: 'deptag', description: '部门类型' },
        { name: 'evaluationrequest', description: '等级评定申请' },
        { name: 'requestdetail', description: '申请详情' },
        { name: 'personalquality', description: '人员素质信息' },
        { name: 'msconstruction', description: '管理体系建设情况' },
        { name: 'companyperformance', description: '公司业绩' },
        { name: 'safetool', description: '安全服务工具' },
        { name: 'selfproduct', description: '自主开发产品' },
        { name: 'servicechannel', description: '服务渠道' },
        { name: 'workingenvironment', description: '工作环境' },
        { name: 'contract', description: '合同' },
        { name: 'billingrecord', description: '开票记录' },
        { name: 'paymentrecord', description: '付款记录' },
        { name: 'invoiceinformation', description: '发票信息' },
        { name: 'certificateissuing', description: '证书颁发信息' },
        { name: 'certificateinformation', description: '证书信息' },
        { name: 'evaluation', description: '等级评定' },
        { name: 'evaluationapproval', description: '等级评定审批' },
        { name: 'servicetype', description: '服务类别' },
        { name: 'modular', description: '功能模块' },
        { name: 'jurisdiction', description: '权限' },
        { name: 'article', description: '文章' },
        { name: 'channel', description: '栏目' },
        { name: 'sysconfig', description: '系统配置' },
      ],
      // definitions: {
      //   User: {
      //     $id: 'User',
      //     type: 'object',
      //     required: ['id', 'email'],
      //     properties: {
      //       id: { type: 'string', format: 'uuid' },
      //       firstName: { type: 'string', nullable: true },
      //       lastName: { type: 'string', nullable: true },
      //       email: { type: 'string', format: 'email' },
      //     },
      //   },
      // },
      // TODO: 有空研究一下
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });

  server.ready((err) => {
    if (err) throw err;
    server.swagger();
  });

  next();
});
