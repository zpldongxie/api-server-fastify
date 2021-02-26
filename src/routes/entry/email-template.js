/* eslint-disable max-len */
// 初审通过
const firstResoveTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>
    陕西省信息网络安全协会已收到您的%type%入驻申请。初审结果为
    <span style="color: green">通过</span>。
  </div>
  <br />
  <div>
    本协会相关负责人近期会与您取得联系，请保持通讯畅通。
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
  <div>陕西省信息网络安全协会已收到您的%type%入驻申请，审核结果为<span style="color:red">不通过</span>。</div>
  <br />
  <div>拒绝原因：</div>
  <div>%rejectDesc%</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 正式入驻
const formalMemberTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已收到您的%type%入驻申请，终审结果为<span style="color:green">通过</span>。</div>
  <br />
  <div>在此，恭喜您入驻成功，有效期为一年</div>
  <br />
  <div>在此期间，您享有以下权益：</div>
  <div>1.在本协会官方网站免费展示入驻信息；</div>
  <div>2.其他宣传推广机会</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 禁用
const disableTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已将您的%type%入驻资格禁用。</div>
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
