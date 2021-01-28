/* eslint-disable max-len */
// 初审通过
const firstResoveTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>
    陕西省信息网络安全协会已收到您的会员入会申请。初审结果为
    <span style="color: green">通过</span>。
  </div>
  <br />
  <div>
    <a href="http://www.snains.cn/upload/file/201709/%E4%B8%AA%E4%BA%BA%E4%BC%9A%E5%91%98%E7%BB%88%E5%AE%A1%E7%94%B3%E8%AF%B7%E4%B9%A6.doc">
      《个人会员终审申请表》
    </a>
    ，填写表格并签字盖章后，一式两份，送至本协会办公室进行终审。
  </div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 审核不通过
const rejectTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已收到您的会员入会申请，审核结果为<span style="color:red">不通过</span>。</div>
  <br />
  <div>拒绝原因：</div>
  <div>%rejectDesc%</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 成为正式会员
const formalMemberTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已收到您的会员入会申请，终审结果为<span style="color:green">通过</span>。</div>
  <br />
  <div>在此，恭喜您成为本协会正式会员，有效期为一年。</div>
  <br />
  <div>在此期间，您享有以下权益：</div>
  <div>1.在本协会官方网站免费展示公司信息；</div>
  <div>2.报名参加本协会组织的相关网络安全会议；</div>
  <div>3.其他宣传推广机会</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 禁用
const disableTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已将您的会员资格禁用。</div>
  <br />
  <div>如有任何疑问，请联系本协会相关负责人。</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;

module.exports = {
  firstResoveTemplate,
  rejectTemplate,
  formalMemberTemplate,
  disableTemplate,
};
