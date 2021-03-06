/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-06 23:47:51
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
const CommonMethod = require('../commonMethod');

const DepMethod = require('../department/method');
const { departmentTag } = require('../../dictionary');

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
    this.depMethod = new DepMethod(mysql, 'Department', ajv);
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
            model: this.mysql.Department,
            attributes: ['id', 'name'],
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
   * 创建服务单位账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatSQDWQ(userInfo) {
    // 查找申请单位部门
    const sqdwDep = await this.mysql.Department.findOne({
      where: { tag: departmentTag.申请单位 },
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
   * 创建审核机构审核员账号
   *
   * @param {*} userInfo 用户信息
   * @return {*}
   * @memberof Method
   */
  async creatSHY(userInfo) {
    const { companyName, ...info } = userInfo;
    // 查找评审机构部门
    const psjgDep = await this.mysql.Department.findOne({
      where: { tag: departmentTag.评审机构 },
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
      where: { parentId: companyDep.id, tag: departmentTag.审核员 },
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
    const { companyName, ...info } = userInfo;
    // 查找评审机构部门
    const psjgDep = await this.mysql.Department.findOne({
      where: { tag: departmentTag.评审机构 },
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
    // 开始创建账号
    const user = await this.model.create(info);
    if (user) {
      user.setDepartments(dep);
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
    // 查找公约委员会部门
    const wyhDep = await this.mysql.Department.findOne({
      where: { tag: departmentTag.公约委员会 },
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
      where: { parentId: companyDep.id, tag: departmentTag.评定决定员 },
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
    // 查找公约委员会部门
    const wyhDep = await this.mysql.Department.findOne({
      where: { tag: departmentTag.公约委员会 },
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
      where: { tag: departmentTag.网安联 },
      include: [{
        model: this.model,
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
      where: { tag: departmentTag.系统管理员 },
      include: [{
        model: this.model,
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
