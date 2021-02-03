/*
 * @description: 邮件相关路由
 * @author: zpl
 * @Date: 2021-01-26 11:28:51
 * @LastEditTime: 2021-01-29 18:22:43
 * @LastEditors: zpl
 */
const fp = require('fastify-plugin');
const Nodemailer = require('nodemailer');
const { onRouterSuccess } = require('../../util');

const { createTransport } = Nodemailer;

const close = (fastify, done) => {
  fastify.nodemailer.close(done);
};

module.exports = fp(async (server, opts, next) => {
  const mysqlModel = server.mysql.models;
  const sysConfigModel = mysqlModel.SysConfig;

  // 用装饰器初始化邮箱配置
  let transporter = null;
  const sysConfigList = await sysConfigModel.findAll({ where: { group: '邮箱' } });
  const sysConf = {
    host: '',
    port: '',
    user: '',
    pass: '',
  };
  sysConfigList.forEach((sysConfig) => {
    switch (sysConfig.name) {
      case 'host':
        sysConf.host = sysConfig.value;
        break;
      case 'port':
        sysConf.port = sysConfig.value;
        break;
      case 'user':
        sysConf.user = sysConfig.value;
        break;
      case 'pass':
        sysConf.pass = sysConfig.value;
        break;
      default:
        break;
    }
  });
  transporter = createTransport({
    host: sysConf.host,
    port: sysConf.port,
    secure: true, // use TLS
    auth: {
      user: sysConf.user,
      pass: sysConf.pass,
    },
  });
  server
      .decorate('nodemailer', transporter)
      .addHook('onClose', close);

  const editSettingsSchema = require('./edit-settings-schema');
  server.post(
      '/api/email/editSettings',
      { schema: { ...editSettingsSchema, tags: ['邮件'], summary: '修改邮箱配置' } },
      async (request, reply) => {
        console.log('email editSettings begin');
        const { host, port, user, pass, from } = request.body;
        await sysConfigModel.update({ value: host }, { where: { name: 'host', group: '邮箱' } });
        await sysConfigModel.update({ value: port }, { where: { name: 'port', group: '邮箱' } });
        await sysConfigModel.update({ value: user }, { where: { name: 'user', group: '邮箱' } });
        await sysConfigModel.update({ value: pass }, { where: { name: 'pass', group: '邮箱' } });
        await sysConfigModel.update({ value: from }, { where: { name: 'from', group: '邮箱' } });
        transporter = createTransport({
          host,
          port,
          secure: true, // use TLS
          auth: {
            user,
            pass,
          },
        });

        server.nodemailer = transporter;

        onRouterSuccess(reply, null, '设置成功');
      },
  );

  const sendmailSchema = require('./sendmail-schema');
  server.post(
      '/api/mail/send',
      {
        schema: { ...sendmailSchema, tags: ['邮件'], summary: '发送邮件' },
      },
      async (request, reply) => {
        console.log('email send begin');
        const { mailTo, subject, text, html } = request.body;
        const from = await sysConfigModel.findOne({ where: { name: 'from', group: '邮箱' } });
        const info = await server.nodemailer.sendMail({
          from: from.value,
          to: mailTo,
          subject,
          text,
          html,
        });
        onRouterSuccess(reply, {
          messageId: info.messageId,
        });
      },
  );

  next();
});
