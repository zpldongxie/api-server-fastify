/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-25 09:51:45
 * @LastEditors: zpl
 */
const CommonMethod = require('../commonMethod');
const UserMethod = require('../user/method');
const { linkName, processStatus } = require('../../dictionary');

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
    this.userMethod = new UserMethod(mysql, 'User', ajv);
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
   * 根据条件获取列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async queryList(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [];
          const res = await that.dbMethod.queryList({
            where,
            filter,
            sorter,
            current,
            pageSize,
            attributes,
            include,
          });
          return res;
        },
    );
  }

  /**
   * 新增
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async create(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const info = request.body;
          const include = [];
          const res = await that.dbMethod.create(info, { include });
          return res;
        },
    );
  }

  /**
   * 更新
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async update(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { id, ...info } = request.body;
          const res = await that.dbMethod.updateOne(id, info);
          return res;
        },
    );
  }

  /**
   * 新增或更新
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async upsert(request, reply) {
    const that = this;
    const { id } = request.body;
    if (id) {
      await that.update(request, reply);
    } else {
      await that.create(request, reply);
    }
  }

  /**
   * 查询指定流程的所有审核记录
   *
   * @param {*} id 流程ID
   * @return {*}
   * @memberof Method
   */
  async getApprovalHistory(id) {
    await this.dbMethod.findAll({
      where: {
        EvaluationRequestId: id,
      },
      sorter: {
        createdAt: 'desc',
      },
    });
    return {
      status: 1,
      message: '查询成功',
      data: [],
    };
  }

  /**
   * 查询流程当前所处的环节
   *
   * @param {*} id 流程ID
   * @return {*}
   * @memberof Method
   */
  async getCurrentLinkName(id) {
    const res = await this.dbMethod.findOne({
      where: {
        EvaluationRequestId: id,
        handlingOpinions: '待处理',
      },
    });
    return {
      status: 1,
      message: '查询成功',
      data: res.status ? res.data.list[0] : null,
    };
  }

  /**
   * 创建审核流
   *
   * @param {*} { EvaluationRequestId, ...info }
   * @return {*}
   * @memberof Method
   */
  async createApproval({ EvaluationRequestId, ...info }) {
    const evaRequest = await this.mysql.EvaluationRequest.findOne({
      where: { id: EvaluationRequestId },
    });
    if (!evaRequest) {
      return {
        status: 0,
        message: '流程ID无效',
      };
    }
    const res = await this.dbMethod.create({ ...info, EvaluationRequestId });
    if (res.status) {
      switch (info.linkName) {
        case linkName.payment:
          // 缴费确认
          evaRequest.processStatus = processStatus.pendingPayment;
          break;
        case linkName.completeness:
          // 完备性审核
        case linkName.auditor:
          // 分配审核员
        case linkName.document:
          // 文档审核
        case linkName.onSite:
          // 现场审核
        case linkName.decision:
          // 评定决定
        case linkName.issueACer:
          // 颁发证书
        case linkName.publicCer:
          // 发布证书
          evaRequest.processStatus = processStatus.underReview;
          break;
        case linkName.finished:
          // 完成
          evaRequest.processStatus = processStatus.finished;
          break;
        default:
          break;
      }
      await evaRequest.save();
    }

    return res;
  }

  /**
   * 更新审批状态
   *
   * @param {*} id
   * @param {*} handlingOpinions 审批结果
   * @param {*} notes 审批意见
   * @param {*} approvalFiles 审核文档
   * @param {*} currentUserId 当前登录的账号
   * @param {*} nextAuditorId 下一步审核人
   * @return {*}
   * @memberof Method
   */
  async updateApproval(id, handlingOpinions, notes, approvalFiles, currentUserId, nextAuditorId) {
    // 根据ID查找审核流，同时获取到提交申请的用户ID
    const evaAppRes = await this.dbMethod.findById(id, [{
      model: this.mysql.EvaluationRequest,
      attributes: ['id'],
      include: [{
        model: this.mysql.User,
        attributes: ['id', 'loginName'],
      }],
    }]);
    if (!evaAppRes.status) {
      return {
        status: 0,
        message: '审核ID无效',
      };
    }
    // 更新审批信息
    const evaApp = evaAppRes.data;
    // evaApp.executiveId = currentUserId;
    evaApp.handlingOpinions = handlingOpinions;
    evaApp.notes = notes;
    evaApp.approvalFiles = approvalFiles;
    await evaApp.save();

    // 流程提交人ID
    const initApplicantId = evaApp.EvaluationRequest.User.id;

    // 申请人ID
    const applicantId = evaApp.applicantId;

    let nextLinkName;
    let nextExecutiveId;
    switch (evaApp.linkName) {
      case linkName.completeness:
        // 完备性审核
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.payment;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = null;
          nextExecutiveId = null;
        }
        break;
      case linkName.payment:
        // 缴费确认
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.auditor;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = linkName.completeness;
          nextExecutiveId = applicantId;
        }
        break;
      case linkName.auditor:
        // 分配审核员
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.document;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = linkName.payment;
          nextExecutiveId = applicantId;
        }
        break;
      case linkName.document:
        // 文档审核
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.onSite;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = null;
          nextExecutiveId = null;
        }
        break;
      case linkName.onSite:
        // 现场审核
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.decision;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = null;
          nextExecutiveId = null;
        }
        break;
      case linkName.decision:
        // 评定决定
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.issueACer;
          nextExecutiveId = nextAuditorId;
          // 同步用户信息
          const syncRes = await this.userMethod.doSyncUserExtension(initApplicantId, evaApp.EvaluationRequest.id);
          console.log(syncRes);
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = linkName.onSite;
          nextExecutiveId = applicantId;
        }
        break;
      case linkName.issueACer:
        // 颁发证书
        if (handlingOpinions === '通过') {
          // TODO: 生成证书

          // 判断下一步执行人
          nextLinkName = linkName.publicCer;
          const nextUserRes = await this.dbMethod.findOne({
            where: {
              EvaluationRequestId: evaApp.EvaluationRequestId,
              linkName: '完备性审核',
            },
          });
          if (!nextUserRes) {
            return {
              status: 0,
              message: '无法找到该流程中的项目管理员信息',
            };
          }
          nextExecutiveId = nextUserRes.data.executiveId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = linkName.decision;
          nextExecutiveId = applicantId;
        }
        break;
      case linkName.publicCer:
        // 发布证书
        if (handlingOpinions === '通过') {
          nextLinkName = linkName.finished;
          nextExecutiveId = nextAuditorId;
        }
        if (handlingOpinions === '不通过') {
          nextLinkName = linkName.publicCer;
          nextExecutiveId = currentUserId;
        }
        break;
      default:
        break;
    }

    // 创建下一个审批流
    if (nextLinkName) {
      const cRes = await this.createApproval({
        EvaluationRequestId: evaApp.EvaluationRequestId,
        linkName: nextLinkName,
        applicantId: currentUserId,
        executiveId: nextExecutiveId,
      });
      if (!cRes.status) {
        evaApp.handlingOpinions = '待处理';
        await evaApp.save();
      }
      return cRes;
    } else {
      // 只有不通过并且流程走向申请单位时，不产生新的流程记录，此时把流程状态置为已驳回即可
      await this.mysql.EvaluationRequest.update(
          { processStatus: processStatus.rejected },
          { where: { id: evaApp.EvaluationRequestId } },
      );
    }
    return {
      status: 1,
      message: '操作成功',
      data: null,
    };
  }

  /**
   * 审核
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async approval(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const { id, EvaluationRequestId, nextAuditorId, ...info } = request.body;

          // const currentLinkName = await that.getCurrentLinkName(EvaluationRequestId);
          // console.log(currentLinkName);
          if (id) {
            return await that.updateApproval(
                id,
                info.handlingOpinions,
                info.notes,
                info.approvalFiles,
                currentUserId,
                nextAuditorId,
            );
          }
          return await that.createApproval({
            ...info,
            EvaluationRequestId,
            applicantId: currentUserId,
            executiveId: nextAuditorId,
          });
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
