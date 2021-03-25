/*
 * @description: 等级评定申请路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-24 19:43:55
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');
const ServiceTypeMethod = require('../servicetype/method');
const RequestDetailMethod = require('../requestdetail/method');
const PersonalQualityMethod = require('../personalquality/method');
const MSConstructionMethod = require('../msconstruction/method');
const CompanyPerformanceMethod = require('../companyperformance/method');
const SelfProductMethod = require('../selfproduct/method');
const SafeToolMethod = require('../safetool/method');
const WorkingEnvironmentMethod = require('../workingenvironment/method');
const ServiceChannelMethod = require('../servicechannel/method');
const UploadRecordMethod = require('../uploadrecord/method');

const { processStatus, departmentTag } = require('../../dictionary');

/**
 * 等级评定申请路由用到的方法
 *
 * @class Method
 * @extends {CommonMethod}
 */
class Method extends CommonMethod {
  /**
   * Creates an instance of 等级评定 Method.
   * @param {*} mysql
   * @param {*} modelName
   * @param {*} ajv
   * @memberof Method
   */
  constructor(mysql, modelName, ajv) {
    super(mysql[modelName], ajv);
    this.mysql = mysql;
    this.model = mysql[modelName];
    /**
     * 服务类别
     */
    this.serviceTypeMethod = new ServiceTypeMethod(mysql, 'ServiceType', ajv);
    /**
     * 申请详情
     */
    this.requestDetailMethod = new RequestDetailMethod(mysql, 'RequestDetail', ajv);
    /**
     * 人员素质信息
     */
    this.personalQualityMethod = new PersonalQualityMethod(mysql, 'PersonalQuality', ajv);
    /**
     * 管理体系
     */
    this.msConstructionMethod = new MSConstructionMethod(mysql, 'MSConstruction', ajv);
    /**
     * 公司业绩
     */
    this.companyPerformanceMethod = new CompanyPerformanceMethod(mysql, 'CompanyPerformance', ajv);
    /**
     * 自主开发产品
     */
    this.selfProductMethod = new SelfProductMethod(mysql, 'SelfProduct', ajv);
    /**
     * 安全服务工具
     */
    this.safeToolMethod = new SafeToolMethod(mysql, 'SafeTool', ajv);
    /**
     * 工作环境设施
     */
    this.workingEnvironmentMethod = new WorkingEnvironmentMethod(mysql, 'WorkingEnvironment', ajv);
    /**
     * 服务渠道
     */
    this.serviceChannelMethod = new ServiceChannelMethod(mysql, 'ServiceChannel', ajv);
    /**
     * 上传记录
     */
    this.uploadRecordMethod = new UploadRecordMethod(mysql, 'UploadRecord', ajv);
  }

  /**
   * 根据ID获取流程所有信息
   *
   * @param {*} id
   * @return {*}
   * @memberof Method
   */
  async doGetById(id) {
    const that = this;
    const res = await that.dbMethod.findById(id, [{
      model: that.mysql.User,
      attributes: ['id', 'loginName'],
    }, {
      model: that.mysql.ServiceType,
    }, {
      model: that.mysql.RequestDetail,
    }, {
      model: that.mysql.PersonalQuality,
    }, {
      model: that.mysql.MSConstruction,
    }, {
      model: that.mysql.CompanyPerformance,
    }, {
      model: that.mysql.SelfProduct,
    }, {
      model: that.mysql.SafeTool,
    }, {
      model: that.mysql.WorkingEnvironment,
    }, {
      model: that.mysql.ServiceChannel,
    }, {
      model: that.mysql.UploadRecord,
    }, {
      model: that.mysql.EvaluationApproval,
    }]);

    if (res.status) {
      const { data } = res;
      const newData = {
        'id': data.id,
        'processStatus': data.processStatus,
        'createdAt': data.createdAt,
        'updatedAt': data.updatedAt,
        'user': data.User,
        'applyInfo': {
          'level': data.level,
          'nature': data.nature,
          'requestCategory': data.ServiceTypes.map((item) => ({ id: item.id, name: item.name })),
          'requestType': data.requestType,
        },
      };
      // 企业基本信息
      newData.companyInfo = data.RequestDetail ? {
        'id': data.RequestDetail.id,
        'companyName': data.RequestDetail.companyName,
        'department': data.RequestDetail.department,
        'detailed': data.RequestDetail.detailed,
        'communication': data.RequestDetail.communication,
        'postcode': data.RequestDetail.postcode,
        'legalPerson': data.RequestDetail.legalPerson,
        'legalPersonTel': data.RequestDetail.legalPersonTel,
        'legalPersonMobile': data.RequestDetail.legalPersonMobile,
        'legalPersonFax': data.RequestDetail.legalPersonFax,
        'legalPersonEmail': data.RequestDetail.legalPersonEmail,
        'contact': data.RequestDetail.contact,
        'contactTel': data.RequestDetail.contactTel,
        'contactMobile': data.RequestDetail.contactMobile,
        'contactFax': data.RequestDetail.contactFax,
        'contactEmail': data.RequestDetail.contactEmail,
        'registrationNu': data.RequestDetail.registrationNu,
        'registeredCapital': data.RequestDetail.registeredCapital,
        'established': data.RequestDetail.established,
        'typeOfEnterprise': data.RequestDetail.typeOfEnterprise,
        'businessScope': data.RequestDetail.businessScope,
        'shareholder': data.RequestDetail.shareholder,
        'ratioOfShareholders': data.RequestDetail.ratioOfShareholders,
        'percentageOfChinese': data.RequestDetail.percentageOfChinese,
      } : {};

      // 人员素质信息
      newData.personalQuality = data.PersonalQuality ? {
        'id': data.PersonalQuality.id,
        'totalCo': data.PersonalQuality.totalCo,
        'leaderAgeLimit': data.PersonalQuality.leaderAgeLimit,
        'techLeaderName': data.PersonalQuality.techLeaderName,
        'techLeaderMajor': data.PersonalQuality.techLeaderMajor,
        'techLeaderTitle': data.PersonalQuality.techLeaderTitle,
        'techLeaderAgeLimit': data.PersonalQuality.techLeaderAgeLimit,
        'financeLeaderName': data.PersonalQuality.financeLeaderName,
        'financeLeaderMajor': data.PersonalQuality.financeLeaderMajor,
        'financeLeaderTitleAges': data.PersonalQuality.financeLeaderTitleAges,
        'totalSecurity': data.PersonalQuality.totalSecurity,
        'undergraduateNum': data.PersonalQuality.undergraduateNum,
        'undergraduateShare': data.PersonalQuality.undergraduateShare,
        'masterNum': data.PersonalQuality.masterNum,
        'masterShare': data.PersonalQuality.masterShare,
        'doctorNum': data.PersonalQuality.doctorNum,
        'doctorShare': data.PersonalQuality.doctorShare,
        'technicianNum': data.PersonalQuality.technicianNum,
      } : {};

      // 管理体系建设
      newData.managerialSystem = data.MSConstructions.map((ms) => ({
        'id': ms.id,
        'systemName': ms.systemName,
        'buildingProgress': ms.buildingProgress,
        'isItCertified': ms.isItCertified,
        'issuingAgency': ms.issuingAgency,
      }));

      // 公司业绩
      newData.companyPerformance = data.CompanyPerformance ? {
        'id': data.CompanyPerformance.id,
        'programsNum': data.CompanyPerformance.programsNum,
        'totalAmount': data.CompanyPerformance.totalAmount,
        'sameProgramsNum': data.CompanyPerformance.sameProgramsNum,
        'sameAmount': data.CompanyPerformance.sameAmount,
        'sameSingleProgramNum': data.CompanyPerformance.sameSingleProgramNum,
      } : {};

      // 基本技术能力
      newData.basicSkills = {};
      // 产品信息
      newData.basicSkills.proInfo = data.SelfProducts.map((sp) => ({
        'id': sp.id,
        'productName': sp.productName,
        'descStr': sp.descStr,
        'features': sp.features,
        'certificationStatus': sp.certificationStatus,
      }));
      // 常用安全服务工具
      newData.basicSkills.securityTool = data.SafeTools.map((st) => ({
        'id': st.id,
        'name': st.name,
        'descStr': st.descStr,
        'version': st.version,
        'provider': st.provider,
      }));
      // 工作环境设施情况
      newData.basicSkills.workEnv = data.WorkingEnvironments.map((we) => ({
        'id': we.id,
        'type': we.type,
        'model': we.model,
        'quantity': we.quantity,
      }));
      // 服务渠道
      newData.basicSkills.serviceChannels = data.ServiceChannels.map((sc) => ({
        'id': sc.id,
        'type': sc.type,
        'details': sc.details,
      }));

      // 附件
      newData.updateRecords = data.UploadRecords.map((ur) => ({
        'id': ur.id,
        'title': ur.title,
        'path': ur.path,
        'remark': ur.remark,
      }));

      // 审核记录
      newData.evaluationApprovals = data.EvaluationApprovals.sort((a, b) => {
        const v1 = new Date(a.createdAt).getTime();
        const v2 = new Date(b.createdAt).getTime();
        return v2 - v1;
      });

      res.data = newData;
    }
    return res;
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
          return that.doGetById(id);
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
          const res = await that.dbMethod.findAll({
            include: [{
              model: that.mysql.User,
              attributes: ['id', 'loginName'],
            }, {
              model: that.mysql.ServiceType,
            }],
          });
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
          const include = [{
            model: that.mysql.User,
            attributes: ['id', 'loginName'],
          }, {
            model: that.mysql.ServiceType,
            required: true,
          }, {
            model: that.mysql.RequestDetail,
            required: true,
          }, {
            model: that.mysql.EvaluationApproval,
            required: true,
          }];
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
   * 根据条件获取当前用户申请列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getListForCurrentUser(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const currentUser = await that.mysql.User.findOne({ where: { id: currentUserId } });
          if (!currentUser) {
            return {
              status: 0,
              message: '请先登录',
            };
          }

          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          where.UserId = currentUserId;
          const attributes = {};
          const include = [{
            model: that.mysql.ServiceType,
            required: true,
          }, {
            model: that.mysql.RequestDetail,
            required: true,
          }];
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
   * 根据条件获取当前用户待审核列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getListForAuditor(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const currentUser = await that.mysql.User.findOne({ where: { id: currentUserId } });
          if (!currentUser) {
            return {
              status: 0,
              message: '请先登录',
            };
          }

          const {
            current,
            pageSize,
            sorter,
            filter,
            ...where
          } = request.body;
          const attributes = {};
          const include = [{
            model: that.mysql.User,
            attributes: ['id', 'loginName'],
            required: true,
          }, {
            model: that.mysql.ServiceType,
            required: true,
          }, {
            model: that.mysql.RequestDetail,
            required: true,
          }, {
            model: that.mysql.EvaluationApproval,
            where: {
              executiveId: currentUserId,
            },
          // order: [
          //   // [that.mysql.EvaluationApproval, 'updatedAt', 'DESC'],
          //   [that.mysql.EvaluationApproval, 'createdAt', 'DESC'],
          // ],
          }];
          const res = await that.dbMethod.queryList({
            where,
            filter,
            sorter,
            current,
            pageSize,
            attributes,
            include,
          });

          if (res.status) {
            res.data.list.forEach((eq) => {
              const eaList = eq.EvaluationApprovals.sort((a, b) => {
                const v1 = new Date(a.createdAt).getTime();
                const v2 = new Date(b.createdAt).getTime();
                return v2 - v1;
              });
              eq.EvaluationApprovals = eaList;
            });
          }
          return res;
        },
    );
  }

  /**
   * 初次申请
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async initialRequest(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            id,
            data: {
              level,
              requestType,
              nature,
              requestCategory,
            },
          } = request.body;
          const currentUser = await that.mysql.User.findOne({
            where: {
              id: request.user.id,
            },
            include: [{
              model: that.mysql.Department,
              required: true,
              include: [{
                model: that.mysql.DepTag,
                required: true,
              }],
            }],
          });
          const serviceTypeRes = await that.serviceTypeMethod.dbMethod.queryList({
            where: { id: { [Op.in]: requestCategory } },
          });

          if (!currentUser) {
            return {
              status: 0,
              message: '用户ID无效',
            };
          }
          if (currentUser.Departments[0].DepTag.name !== departmentTag.申请单位) {
            return {
              status: 0,
              message: '当前用户不可提交申请',
            };
          }
          if (!serviceTypeRes.status) {
            return {
              status: 0,
              message: '服务类别无效',
            };
          }

          let res;
          if (id) {
            res = await that.dbMethod.updateOne(id, { level, requestType, nature });
          } else {
          // 重复申请判断
            const oldRes = await that.dbMethod.findOne({
              where: {
                level,
              },
              // TODO: 后期应加上流程状态和有效期的判断
              include: [{
                model: that.mysql.User,
                where: {
                  id: currentUser.id,
                },
              }, {
                model: that.mysql.ServiceType,
                where: {
                  id: { [Op.in]: requestCategory },
                },
              }],
            });
            if (oldRes.status) {
              return {
                status: 0,
                message: '该用户已存在同类型申请，请不要重复提交',
              };
            }
            res = await that.dbMethod.create({ level, requestType, nature, processStatus: processStatus.toSubmit });
          }
          if (!res.status) {
            return res;
          }
          const { data } = res;
          data.setUser(currentUser);
          data.setServiceTypes(serviceTypeRes.data.list);
          await data.save();
          return {
            status: 1,
            message: '保存成功',
            data,
          };
        },
    );
  }

  /**
   * 保存基本技术能力
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async saveBasicTechnology(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            id,
            data: {
              proInfo,
              securityTool,
              workEnv,
              serviceChannels,
            },
          } = request.body;
          const res1 = await that.selfProductMethod.doSaveOnRequest(id, proInfo);
          const res2 = await that.safeToolMethod.doSaveOnRequest(id, securityTool);
          const res3 = await that.workingEnvironmentMethod.doSaveOnRequest(id, workEnv);
          const res4 = await that.serviceChannelMethod.doSaveOnRequest(id, serviceChannels);
          return {
            status: 1,
            data: {
              proInfo: res1,
              securityTool: res2,
              workEnv: res3,
              serviceChannels: res4,
            },
            message: '保存成功',
          };
        },
    );
  }

  /**
   * 批量删除
   *
   * @param {*} ids
   * @return {*}
   * @memberof Method
   */
  async doRemove(ids) {
    const that = this;
    // 删除申请详情
    await that.requestDetailMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除人员素质信息
    await that.personalQualityMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除管理体系建设
    await that.msConstructionMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除公司业绩
    await that.companyPerformanceMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除自主开发产品
    await that.selfProductMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除安全服务工具
    await that.safeToolMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除工作环境设施
    await that.workingEnvironmentMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除服务渠道
    await that.serviceChannelMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    // 删除上传记录
    // TODO: 要操作磁盘删除对方的文件
    await that.uploadRecordMethod.dbMethod.deleteMany({
      EvaluationRequestId: { [Op.in]: ids },
    });
    const res = await that.dbMethod.delete(ids);
    return res;
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
          return await that.doRemove(request.body.ids);
        },
    );
  }
}

module.exports = Method;
