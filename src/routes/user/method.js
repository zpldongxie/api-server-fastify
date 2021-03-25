/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-24 20:15:47
 * @LastEditors: zpl
 */
// const sequelize = require('sequelize');
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');

const DepMethod = require('../department/method');
const UserExtensionMethod = require('../userextension/method');
const EvaluationMethod = require('../evaluation/method');
const EvaluationRequestMethod = require('../evaluationrequest/method');
const InvoiceInformationMethod = require('../invoiceinformation/method');
const MSConstructionMethod = require('../msconstruction/method');
const SelfProductMethod = require('../selfproduct/method');
const SafeToolMethod = require('../safetool/method');
const WorkingEnvironmentMethod = require('../workingenvironment/method');
const ServiceChannelMethod = require('../servicechannel/method');
const { departmentTag } = require('../../dictionary');

/**
 * 用户路由用到的方法
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
    this.depMethod = new DepMethod(mysql, 'Department', ajv);
    this.userExtensionMethod = new UserExtensionMethod(mysql, 'UserExtension', ajv);
    this.evaluationMethod = new EvaluationMethod(mysql, 'Evaluation', ajv);
    this.evaluationRequestMethod = new EvaluationRequestMethod(mysql, 'EvaluationRequest', ajv);
    this.invoiceInformationMethod = new InvoiceInformationMethod(mysql, 'InvoiceInformation', ajv);
    this.msConstructionMethod = new MSConstructionMethod(mysql, 'MSConstruction', ajv);
    this.selfProductMethod = new SelfProductMethod(mysql, 'SelfProduct', ajv);
    this.safeToolMethod = new SafeToolMethod(mysql, 'SafeTool', ajv);
    this.workingEnvironmentMethod = new WorkingEnvironmentMethod(mysql, 'WorkingEnvironment', ajv);
    this.serviceChannelMethod = new ServiceChannelMethod(mysql, 'ServiceChannel', ajv);
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
          const include = [{
            model: this.mysql.Department,
            attributes: ['id', 'name'],
            include: [{
              model: this.mysql.DepTag,
              attributes: ['id', 'name', 'descStr'],
            }],
          }];
          const res = await that.dbMethod.findById(id, include);
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
          const attributes = {
            exclude: ['password'],
          };
          const include = [{
            model: this.mysql.Department,
            attributes: ['id', 'name'],
            include: [{
              model: this.mysql.DepTag,
              attributes: ['id', 'name', 'descStr'],
            }],
          }];
          const res = await that.dbMethod.findAll({ attributes, include });
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
            departmentIds,
            ...where
          } = request.body;
          const attributes = {
            exclude: ['password'],
          };
          const include = [{
            model: that.mysql.Department,
            attributes: ['id', 'name'],
            include: [{
              model: this.mysql.DepTag,
              attributes: ['id', 'name', 'descStr'],
              required: true,
            }],
          }, {
            model: that.mysql.UserExtension,
          }];
          if (departmentIds) {
            include[0].where = { id: { [Op.in]: departmentIds } };
          }
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
   * 获取项目管理员列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getXmglyList(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const { requestLevel } = request.body;
          const currentUserRes = await that.dbMethod.findById(currentUserId);
          if (!currentUserRes.status) {
            return {
              status: 0,
              message: '请先登录',
            };
          }
          const currentUser = currentUserRes.data;
          const res = await that.dbMethod.findAll({
            where: {
              province: currentUser.province,
            },
            attributes: ['id', 'loginName'],
            include: [{
              model: that.mysql.Department,
              where: {},
              include: [{
                model: that.mysql.DepTag,
                where: {
                  name: departmentTag.项目管理员,
                },
              }],
            }, {
              model: that.mysql.UserExtension,
              where: {
                title: 'judgingLevel',
                info: { [Op.gte]: requestLevel },
              },
              // TODO: 最好转换类型后再做对比
              // where: sequelize.and(
              //     { title: 'judgingLevel' },
              //     sequelize.where(
              //         sequelize.cast('UserExtensions.info', 'SIGNED'),
              //         {
              //           [Op.gte]: requestLevel,
              //         },
              //     ),
              // ),
            }],
          });
          return res;
        },
    );
  }

  /**
   * 获取审核员列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getShyList(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const currentUserRes = await that.dbMethod.findById(currentUserId, [{
            model: that.mysql.Department,
            attributes: ['id', 'name'],
          }]);
          if (!currentUserRes.status) {
            return {
              status: 0,
              message: '请先登录',
            };
          }
          const currentDep = currentUserRes.data.Departments[0];
          const shyDep = await that.mysql.Department.findOne({
            where: {
              parentId: currentDep.id,
            },
            include: [{
              model: that.model,
              attributes: ['id', 'loginName'],
            }, {
              model: that.mysql.DepTag,
              where: {
                name: departmentTag.审核员,
              },
            }],
          });

          if (shyDep) {
            return {
              status: 1,
              data: shyDep.Users,
              message: '查询成功',
            };
          }
          return {
            status: 1,
            data: [],
            message: '查询失败，未找到对应的审核员部门信息',
          };
          // const res = await that.dbMethod.findAll({
          //   where: {},
          //   attributes: ['id', 'loginName'],
          //   include: [{
          //     model: that.mysql.Department,
          //     where: { id: currentDep.id },
          //     include: [{
          //       model: that.mysql.DepTag,
          //       where: {
          //         name: departmentTag.审核员,
          //       },
          //     }],
          //   }],
          // });
          // return res;
        },
    );
  }

  /**
   * 获取评定决定员列表
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async getPdjdyList(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const currentUserId = request.user.id;
          const currentUserRes = await that.dbMethod.findById(currentUserId);
          if (!currentUserRes.status) {
            return {
              status: 0,
              message: '请先登录',
            };
          }
          const userListRes = await that.dbMethod.findAll({
            where: {
              province: currentUserRes.data.province,
            },
            attributes: ['id', 'loginName'],
            include: [{
              model: that.mysql.Department,
              where: {},
              include: [{
                model: that.mysql.DepTag,
                where: {
                  name: departmentTag.评定决定员,
                },
              }],
            }],
          });
          if (!userListRes.status) {
            return {
              status: 1,
              message: '未查询到评定决定员信息',
              data: [],
            };
          }
          return userListRes;
        },
    );
  }

  /**
   * 创建服务单位账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatSQDWQ(userInfo) {
    // 查找申请单位部门
    const sqdwDep = await this.mysql.Department.findOne({
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.申请单位 },
      }],
    });
    if (!sqdwDep) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 开始创建，同步创建companyName扩展信息
    const user = await this.model.create({
      ...userInfo,
      UserExtensions: [
        {
          title: 'companyName',
          info: userInfo.loginName,
          remark: '单位名称',
        },
      ],
    }, {
      include: [this.mysql.UserExtension],
    });
    if (user) {
      user.setDepartments(sqdwDep);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '服务单位账号创建成功',
      };
    }
    return {
      status: 0,
      message: '服务单位账号创建失败',
    };
  }

  /**
   * 创建评审机构审核员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatSHY(userInfo) {
    const { companyName, ...info } = userInfo;
    if (!companyName) {
      return {
        status: 0,
        message: '必须指定单位名称',
      };
    }
    // 查找评审机构部门
    const psjgDep = await this.mysql.Department.findOne({
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.评审机构 },
      }],
    });
    if (!psjgDep) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 查找对应单位
    const companyDep = await this.mysql.Department.findOne({
      where: { name: companyName, parentId: psjgDep.id },
    });
    // 如果对应单位不存在，返回失败，提示先创建管理员账号
    if (!companyDep) {
      return {
        status: 0,
        message: '部门信息不存在，请先创建项目管理员账号',
      };
    }
    // 查找对应审核员部门
    let dep = await this.mysql.Department.findOne({
      where: {
        parentId: companyDep.id,
      },
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.审核员 },
      }],
    });
    // 如果对审核员部门位不存在，则创建，若创建失败，直接返回失败信息
    if (!dep) {
      const res = await this.depMethod.createSHY(companyName);
      if (res.status) {
        dep = res.data;
      } else {
        return {
          status: 0,
          message: '审核员部门信息创建失败，请联系管理员',
        };
      }
    }
    // 开始创建账号
    const user = await this.model.create(info);
    if (user) {
      user.setDepartments(dep);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '审核员账号创建成功',
      };
    }
    return {
      status: 0,
      message: '审核员账号创建失败',
    };
  }

  /**
   * 创建评审机构项目管理员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatXMGLY(userInfo) {
    const { companyName, judgingLevel, ...info } = userInfo;
    if (!companyName) {
      return {
        status: 0,
        message: '必须指定单位名称',
      };
    }
    // 查找评审机构部门
    const psjgDep = await this.mysql.Department.findOne({
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.评审机构 },
      }],
    });
    if (!psjgDep) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 查找对应单位
    let dep = await this.mysql.Department.findOne({
      where: { name: companyName, parentId: psjgDep.id },
      include: [{
        model: this.model,
      }],
    });
    // 如果对应单位不存在，则创建，若创建失败，直接返回失败信息
    if (!dep) {
      const res = await this.depMethod.createPSJG(companyName);
      if (res.status) {
        dep = res.data;
      } else {
        return {
          status: 0,
          message: '部门信息创建失败，请联系管理员',
        };
      }
    }
    // 判断对应单位下是否已有管理员账号
    if (dep.Users && dep.Users.length) {
      return {
        status: 0,
        message: '该单位已有项目管理员账号，请勿重复创建',
      };
    }
    // 判断是否传入审核级别
    if (!judgingLevel) {
      return {
        status: 0,
        message: '必须指定审核级别',
      };
    }
    // 开始创建账号
    const user = await this.model.create({
      ...info,
      UserExtensions: [
        {
          title: 'judgingLevel',
          info: judgingLevel,
          remark: '审核级别',
        },
      ],
    }, {
      include: [this.mysql.UserExtension],
    });
    if (user) {
      user.setDepartments(dep);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '项目管理员账号创建成功',
      };
    }
    return {
      status: 0,
      message: '项目管理员账号创建失败',
    };
  }

  /**
   * 创建委员会评定决定员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatPDJDY(userInfo) {
    const { companyName, ...info } = userInfo;
    if (!companyName) {
      return {
        status: 0,
        message: '必须指定单位名称',
      };
    }
    // 查找公约委员会部门
    const wyhDep = await this.mysql.Department.findOne({
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.公约委员会 },
      }],
    });
    if (!wyhDep) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 查找对应单位
    const companyDep = await this.mysql.Department.findOne({
      where: { name: companyName, parentId: wyhDep.id },
    });
    // 如果对应单位不存在，返回错误，提示先创建管理员账号
    if (!companyDep) {
      return {
        status: 0,
        message: '部门信息不存在，请先创建委员会管理员账号',
      };
    }
    // 查找对应评定决定员部门
    let dep = await this.mysql.Department.findOne({
      where: {
        parentId: companyDep.id,
      },
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.评定决定员 },
      }],
    });
    // 如果对评定决定员部门位不存在，则创建，若创建失败，直接返回失败信息
    if (!dep) {
      const res = await this.depMethod.createWYHPDJDY(companyName);
      if (res.status) {
        dep = res.data;
      } else {
        return {
          status: 0,
          message: '评定决定员部门信息创建失败，请联系管理员',
        };
      }
    }
    // 开始创建账号
    const user = await this.model.create(info);
    if (user) {
      user.setDepartments(dep);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '评定决定员账号创建成功',
      };
    }
    return {
      status: 0,
      message: '评定决定员账号创建失败',
    };
  }

  /**
   * 创建委员会管理员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatWYHGLY(userInfo) {
    const { companyName, ...info } = userInfo;
    if (!companyName) {
      return {
        status: 0,
        message: '必须指定单位名称',
      };
    }
    // 查找公约委员会部门
    const wyhDep = await this.mysql.Department.findOne({
      include: [{
        model: this.mysql.DepTag,
        where: { name: departmentTag.公约委员会 },
      }],
    });
    if (!wyhDep) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 查找对应单位
    let dep = await this.mysql.Department.findOne({
      where: { name: companyName, parentId: wyhDep.id },
      include: [{
        model: this.model,
      }],
    });
    // 如果对应单位不存在，则创建，若创建失败，直接返回失败信息
    if (!dep) {
      const res = await this.depMethod.createWYH(companyName);
      if (res.status) {
        dep = res.data;
      } else {
        return {
          status: 0,
          message: '部门信息创建失败，请联系管理员',
        };
      }
    }
    // 判断对应单位下是否已有管理员账号
    if (dep.Users && dep.Users.length) {
      return {
        status: 0,
        message: '该单位已有管理员账号，请勿重复创建',
      };
    }
    // 开始创建账号
    const user = await this.model.create(info);
    if (user) {
      user.setDepartments(dep);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '委员会管理员账号创建成功',
      };
    }
    return {
      status: 0,
      message: '委员会管理员账号创建失败',
    };
  }

  /**
   * 创建网安联账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async createWAL(userInfo) {
    // 查找网安联部门
    const department = await this.mysql.Department.findOne({
      include: [{
        model: this.model,
      }, {
        model: this.mysql.DepTag,
        where: { name: departmentTag.网安联 },
      }],
    });
    if (!department) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 判断网安联下是否已有账号
    if (department.Users && department.Users.length) {
      return {
        status: 0,
        message: '网安联已有账号，请勿重复创建',
      };
    }
    // 开始创建账号
    const user = await this.model.create(userInfo);
    if (user) {
      user.setDepartments(department);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '网安联账号创建成功',
      };
    }
    return {
      status: 0,
      message: '网安联账号创建失败',
    };
  }

  /**
   * 创建系统管理员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async createXTGLY(userInfo) {
    // 查找系统管理员部门
    const department = await this.mysql.Department.findOne({
      include: [{
        model: this.model,
      }, {
        model: this.mysql.DepTag,
        where: { name: departmentTag.系统管理员 },
      }],
    });
    if (!department) {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
    // 判断系统管理员下是否已有账号
    if (department.Users && department.Users.length) {
      return {
        status: 0,
        message: '系统管理员已有账号，请勿重复创建',
      };
    }

    // 开始创建账号
    const user = await this.model.create(userInfo);
    if (user) {
      user.setDepartments(department);
      await user.save();
      return {
        status: 1,
        data: user,
        message: '系统管理员账号创建成功',
      };
    }
    return {
      status: 0,
      message: '系统管理员账号创建失败',
    };
  }

  /**
   * 创建用户
   * 先查找对应的部门，再根据类型分发处理
   *
   * @param {*} userInfo
   * @memberof Method
   */
  async createUser(userInfo) {
    const { depTag, ...info } = userInfo;
    if (depTag) {
      switch (depTag) {
        case departmentTag.系统管理员:
          return await this.createXTGLY(info);
        case departmentTag.网安联:
          return await this.createWAL(info);
        case departmentTag.公约委员会:
        case departmentTag.委员会管理员:
          return await this.creatWYHGLY(info);
        case departmentTag.评定决定员:
          return await this.creatPDJDY(info);
        case departmentTag.评审机构:
        case departmentTag.项目管理员:
          return await this.creatXMGLY(info);
        case departmentTag.审核员:
          return await this.creatSHY(info);
        case departmentTag.申请单位:
          return await this.creatSQDWQ(info);
        default:
          return {
            status: 0,
            message: '创建申请不在允许范围内',
          };
      }
    } else {
      return {
        status: 0,
        message: '创建申请不在允许范围内',
      };
    }
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
          const res = this.createUser(info);
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
          const { id, depTag, companyName, judgingLevel, logonDate, ...info } = request.body;
          // 删除关联属性
          await that.userExtensionMethod.dbMethod.deleteMany({
            title: {
              [Op.or]: ['companyName', 'judgingLevel'],
            },
            UserId: id,
          });
          // 重新创建关联属性
          await that.userExtensionMethod.dbMethod.create({
            title: 'companyName',
            info: companyName,
            UserId: id,
          }, {
            include: [{
              model: that.mysql.User,
            }],
          });
          if (depTag === departmentTag.项目管理员) {
            // 如果是项目管理员，需要设置审核级别
            await that.userExtensionMethod.dbMethod.create({
              title: 'judgingLevel',
              info: judgingLevel,
              UserId: id,
            }, {
              include: [{
                model: that.mysql.User,
              }],
            });
          }
          // 处理logonDate日期值
          if (logonDate) {
            info.logonDate = logonDate;
          }
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
   * 同步用户扩展信息，流程审核通过后执行
   *
   * @param {*} userId 用户ID
   * @param {*} requestId 流程ID
   * @return {*}
   * @memberof Method
   */
  async doSyncUserExtension(userId, requestId) {
    const userRes = await this.dbMethod.findById(userId);
    if (!userRes.status) {
      return {
        status: 0,
        data: null,
        message: '用户ID无效',
      };
    }
    const requestRes = await this.evaluationRequestMethod.doGetById(requestId);
    if (!requestRes.status) {
      return {
        status: 0,
        data: null,
        message: '流程ID无效',
      };
    }

    const { data } = requestRes;
    await this.mysql.UserExtension.destroy({ where: { UserId: userId } });
    console.time('setUserExtensions');
    await this.mysql.UserExtension.create({
      title: 'companyName', info: data.companyInfo.companyName, remark: '单位名称', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'department', info: data.companyInfo.department, remark: '所属/主管部门', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'detailed', info: data.companyInfo.detailed, remark: '地址', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'communication', info: data.companyInfo.communication, remark: '电话', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'postcode', info: data.companyInfo.postcode, remark: '邮政编码', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'legalPerson', info: data.companyInfo.legalPerson, remark: '法人姓名', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'legalPersonTel', info: data.companyInfo.legalPersonTel, remark: '法人电话', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'legalPersonMobile', info: data.companyInfo.legalPersonMobile, remark: '法人手机', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'legalPersonFax', info: data.companyInfo.legalPersonFax, remark: '法人传真', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'legalPersonEmail', info: data.companyInfo.legalPersonEmail, remark: '法人邮箱', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'contact', info: data.companyInfo.contact, remark: '法定联系人姓名', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'contactTel', info: data.companyInfo.contactTel, remark: '法定联系人电话', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'contactMobile', info: data.companyInfo.contactMobile, remark: '法定联系人手机', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'contactFax', info: data.companyInfo.contactFax, remark: '法定联系人传真', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'contactEmail', info: data.companyInfo.contactEmail, remark: '法定联系人邮箱', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'registrationNu', info: data.companyInfo.registrationNu, remark: '注册号', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'registeredCapital', info: data.companyInfo.registeredCapital, remark: '注册资本（万元）', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'established', info: new Date(data.companyInfo.established).toISOString(), remark: '成立时间', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'typeOfEnterprise', info: data.companyInfo.typeOfEnterprise, remark: '企业类型', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'businessScope', info: data.companyInfo.businessScope, remark: '经营范围', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'percentageOfChinese', info: data.companyInfo.percentageOfChinese, remark: '中国公民或组织持股比例', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'shareholder', info: data.companyInfo.shareholder, remark: '股东名称', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'ratioOfShareholders', info: data.companyInfo.ratioOfShareholders, remark: '股东持股比例', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'nature', info: data.applyInfo.nature, remark: '企业资质', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'totalCo', info: data.personalQuality.totalCo, remark: '企业总人数', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'leaderAgeLimit', info: data.personalQuality.leaderAgeLimit, remark: '负责人从事信息技术管理年限', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'techLeaderName', info: data.personalQuality.techLeaderName, remark: '技术负责人姓名', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'techLeaderMajor', info: data.personalQuality.techLeaderMajor, remark: '技术负责人专业', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'techLeaderTitle', info: data.personalQuality.techLeaderTitle, remark: '技术负责人职称', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'techLeaderAgeLimit',
      info: data.personalQuality.techLeaderAgeLimit,
      remark: '技术负责人从事信息技术工作年限', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'financeLeaderName', info: data.personalQuality.financeLeaderName, remark: '财务负责人姓名', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'financeLeaderMajor', info: data.personalQuality.financeLeaderMajor, remark: '财务负责人职称', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'financeLeaderTitleAges',
      info: new Date(data.personalQuality.financeLeaderTitleAges).toISOString(),
      remark: '财务负责人获得职称时间', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'totalSecurity', info: data.personalQuality.totalSecurity, remark: '安全服务人员总人数', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'undergraduateNum', info: data.personalQuality.undergraduateNum, remark: '安全服务人员本科学历人数', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'undergraduateShare',
      info: data.personalQuality.undergraduateShare,
      remark: '安全服务人员本科占专业技术人员比例', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'masterNum', info: data.personalQuality.masterNum, remark: '安全服务人员硕士学历人数', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'masterShare', info: data.personalQuality.masterShare, remark: '安全服务人员硕士占专业技术人员比例', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'doctorNum', info: data.personalQuality.doctorNum, remark: '安全服务人员博士学历及以上人数', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'doctorShare', info: data.personalQuality.doctorShare, remark: '安全服务人员博士及以上学历占专业技术人员比例', UserId: userId,
    });
    await this.mysql.UserExtension.create({
      title: 'technicianNum', info: data.personalQuality.technicianNum, remark: '安全服务人员网络安全专业技术员人数', UserId: userId,
    });
    console.timeEnd('setUserExtensions');

    return {
      status: 1,
      data: null,
      message: '同步完成',
    };
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
          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // 用户扩展
            await that.userExtensionMethod.dbMethod.deleteMany({ UserId: id });
            // TODO: 等级评定，应该使用封闭方法，连带删除关联信息
            await that.evaluationMethod.dbMethod.deleteMany({ UserId: id });
            // 评定申请
            const er = await that.evaluationRequestMethod.dbMethod.findOne({ UserId: id });
            await that.evaluationRequestMethod.doRemove([er.id]);
            // 用户 - 发票信息， 一对一
            await that.invoiceInformationMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 质量管理体系， 一对多
            await that.msConstructionMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 自主开发产品， 一对多
            await that.selfProductMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 安全服务工具， 一对多
            await that.safeToolMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 工作环境设施， 一对多
            await that.workingEnvironmentMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 服务渠道， 一对多
            await that.serviceChannelMethod.dbMethod.deleteMany({ UserId: id });
            // 用户 - 等级评定审批， 一对多
            await that.mysql.EvaluationApproval.destroy({ where: { UserId: id } });
            await that.dbMethod.delete([id]);
          }
          return {
            status: 1,
            message: '删除完成',
            data: null,
          };
        },
    );
  }
}

module.exports = Method;
