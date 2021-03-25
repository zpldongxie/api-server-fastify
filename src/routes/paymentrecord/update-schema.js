const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('ContractId', S.string().format('uuid').description('合同ID'))
    .prop('amount', S.number().description('付款金额'))
    .prop('payDate', S.string().description('付款时间'))
    .prop('voucher', S.string().description('付款凭证'))
    .required([]);

module.exports = {
  body: bodyJsonSchema,
};
