/* eslint-disable max-len */
// 接受申请
const acceptTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已<span style="color:green">通过</span>您于%createdAt%提交的%demandType%服务申请。</div>
  <br />
  <div>本协会相关负责人会在5个工作日内与您取得联系，就本服务相关事项进行沟通说明，请保持通讯畅通。</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 拒绝申请
const rejectTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已收到您于%createdAt%提交的%demandType%服务申请，审核结果为<span style="color:red">不通过</span>。</div>
  <br />
  <div>拒绝原因：</div>
  <div>%rejectDesc%</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 服务中
const inServiceTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>陕西省信息网络安全协会已正式为您于%createdAt%提交的%demandType%服务申请开始提供服务</div>
  <br />
  <div>服务期间，如有任何疑问，请联系本协会相关负责人。</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;
// 服务完成
const finishedTemplate = `
  <div>%name%:</div>
  <div>您好！</div>
  <br />
  <div>您于%createdAt%提交的%demandType%服务申请已经结束。</div>
  <br />
  <div>在此，陕西省信息网络安全协会感谢您的信任和选择，以及给予我们工作的支持，期待下次合作！</div>
  <br /><br /><br /><br /><br /><br />
  <div style="text-align: right;">陕西省信息网络安全协会</div>
  <div style="text-align: right;">%date%</div>
`;

module.exports = {
  acceptTemplate,
  rejectTemplate,
  inServiceTemplate,
  finishedTemplate,
};
