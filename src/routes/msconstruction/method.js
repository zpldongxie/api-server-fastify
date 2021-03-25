/*
 * @description: 管理体系路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-18 17:34:26
 * @LastEditors: zpl
 */
const CommonMethod = require('../commonMethod');

/**
 * 路由用到的方法
 *
 * @class Method
 * @extends {CommonMethod}
 */
class Method extends CommonMethod {
  /**
   * Creates an instance of Method.
   * @param {*} mysql
   * @param {*} modelName
   * @param {*} ajv
   * @memberof Method
   */
  constructor(mysql, modelName, ajv) {
    super(mysql[modelName], ajv);
    this.mysql = mysql;
    this.model = mysql[modelName];
  }

  /**
   * 根据ID获取单个
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getById(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const id = request.params.id;
          const res = await that.dbMethod.findById(id);
          return res;
        },
    );
  }

  /**
   * 获取所有
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getAll(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const res = await that.dbMethod.findAll();
          return res;
        },
    );
  }

  /**
   * 批量保存到申请中
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async saveOnRequest(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            id,
            data,
          } = request.body;
          const er = await that.mysql.EvaluationRequest.findOne({ where: { id } });
          if (!er) {
            return {
              status: 0,
              message: '申请ID无效',
            };
          }
          await that.dbMethod.deleteMany({ EvaluationRequestId: id });
          let resNum = 0;
          for (let i = 0; i < data.length; i++) {
            const msc = data[i];
            delete msc.id;
            const curRes = await that.dbMethod.create({ ...msc, EvaluationRequestId: id }, {
              include: [{ model: that.mysql.EvaluationRequest }],
            });
            resNum += curRes.status;
          }
          return {
            status: 1,
            message: '操作成功',
            data: {
              listSize: data.length,
              successSize: resNum,
            },
          };
        },
    );
  }

  /**
   * 批量删除
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async remove(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const ids = request.body.ids;
          const res = await that.dbMethod.delete(ids);
          return res;
        },
    );
  }
}

module.exports = Method;
