const S = require('fluent-schema');

const bodyJsonSchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop(
        'data',
        S.array().items(
            S.object()
                .prop('systemName', S.string().description('体系名称'))
                .prop('buildingProgress', S.string().description('建设情况'))
                .prop('isItCertified', S.string().description('是否获证'))
                .prop('issuingAgency', S.string().description('发证机构'))
                .required(['systemName', 'buildingProgress']),
        ),
    )
    .required(['id', 'data']);

module.exports = {
  body: bodyJsonSchema,
};
