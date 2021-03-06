const S = require('fluent-schema');

const { departmentTag, userStatus } = require('../../dictionary');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('loginName', S.string().maxLength(20).description('登录名'))
    .prop('password', S.string().minLength(8).maxLength(64).description('密码'))
    .prop('mobile', S.string().maxLength(11).description('手机'))
    .prop('email', S.string().maxLength(64).format(S.FORMATS.EMAIL).description('邮箱'))
    .prop('province', S.string().maxLength(20).description('所属省份'))
    .prop('verificationCode', S.string().maxLength(20).default('').description('验证码'))
    .prop('logonDate', S.string().format('time').description('注册时间'))
    .prop('status', S.string().enum(Object.values(userStatus)).default(userStatus.applying).description('注册时间'))
    .prop('depTag', S.string().enum(Object.values(departmentTag)).description('所属部门类型'))
    .prop('companyName', S.string().maxLength(64).description('单位名称'))
    .required([]);

module.exports = {
  description: `
    注册时，
    需要传入depTag以明确账号类型，
    评审机构和公约委员会下的账号，需要传入companyName来确定部门名称，
    服务单位直接以公司名称做为登录名，注册成功后需要把loginName同步到扩展信息companyName中
  `,
  body: bodyJsonSchema,
};
