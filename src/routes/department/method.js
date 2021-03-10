/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-03-09 10:23:06
 * @LastEditors: zpl
 */
const CommonMethod = require('../commonMethod');
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
   * 创建审核员部门
   *
   * @param {*} companyName
   * @param {string} [desc='']
   * @param {number} [orderIndex=0]
   * @return {*}
   * @memberof Method
   */
  async createSHY(companyName, desc='', orderIndex=0) {
    const companyDep = await this.model.findOne({ where: { name: companyName } });
    if (companyDep) {
      // 若部门存在，判断是否存在对应的审核员部门
      const jdwDep = await this.model.findOne({ where: { parentId: companyDep.id, tag: departmentTag.审核员 } });
      if (jdwDep) {
        // 若存在，则给出提示
        return {
          status: 0,
          message: '该部门已存在',
        };
      } else {
        // 若不存在，则创建对应的评定决定员部门
        const dep = await this.model.create({
          name: `${companyName}审核员`,
          tag: departmentTag.审核员,
          desc,
          orderIndex,
          parentId: companyDep.id,
        });
        return {
          status: 1,
          data: dep,
          message: `审核员部门创建成功，单位名称：${companyName}`,
        };
      }
    } else {
      return await this.createWYH(companyName);
    }
  }

  /**
   * 创建评审机构
   *
   * @param {*} companyName
   * @param {string} [desc='']
   * @param {number} [orderIndex=0]
   * @return {*}
   * @memberof Method
   */
  async createPSJG(companyName, desc='', orderIndex=0) {
    // 查找评审机构
    const psjgDep = await this.model.findOne({ where: { tag: departmentTag.评审机构 } });
    if (psjgDep) {
      // 创建对应单位，若重名，会触发数据库约束，前台需要处理提示信息
      const dev = await this.model.create({
        name: companyName,
        tag: departmentTag.项目管理员,
        desc,
        orderIndex,
        parentId: psjgDep.id,
      });
      // 同步创建审核员分组
      await this.model.create({
        name: `${companyName}审核员`,
        tag: departmentTag.审核员,
        desc: '',
        parentId: dev.id,
      });
      return {
        status: 1,
        data: dev,
        message: `评审机构创建成功，机构名称：${companyName}`,
      };
    } else {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
      };
    }
  }

  /**
   * 创建委员会评定决定员部门
   *
   * @param {*} companyName
   * @param {string} [desc='']
   * @param {number} [orderIndex=0]
   * @return {*}
   * @memberof Method
   */
  async createWYHPDJDY(companyName, desc='', orderIndex=0) {
    const companyDep = await this.model.findOne({ where: { name: companyName } });
    if (companyDep) {
      // 若部门存在，判断是否存在对应的评定决定员部门
      const jdwDep = await this.model.findOne({ where: { parentId: companyDep.id, tag: departmentTag.评定决定员 } });
      if (jdwDep) {
        // 若存在，则给出提示
        return {
          status: 0,
          message: '该部门已存在',
        };
      } else {
        // 若不存在，则创建对应的评定决定员部门
        const dep = await this.model.create({
          name: `${companyName}评定决定员`,
          tag: departmentTag.评定决定员,
          desc,
          orderIndex,
          parentId: companyDep.id,
        });
        return {
          status: 1,
          data: dep,
          message: `委员会管理员部门创建成功，单位名称：${companyName}`,
        };
      }
    } else {
      // 若部门不存在，则从创建部门开始执行
      return await this.createWYH(companyName);
    }
  }

  /**
   * 创建委员会成员单位
   *
   * @param {*} companyName
   * @param {string} [desc='']
   * @param {number} [orderIndex=0]
   * @return {*}
   * @memberof Method
   */
  async createWYH(companyName, desc='', orderIndex=0) {
    // 查找公约委员会部门
    const wyhDep = await this.model.findOne({ where: { tag: departmentTag.公约委员会 } });
    if (wyhDep) {
      // 创建对应单位，若重名，会触发数据库约束，前台需要处理提示信息
      const dev = await this.model.create({
        name: companyName,
        tag: departmentTag.委员会管理员,
        desc,
        orderIndex,
        parentId: wyhDep.id,
      });
      // 同步创建评定决定员分组
      await this.model.create({
        name: `${companyName}评定决定员`,
        tag: departmentTag.评定决定员,
        desc: '',
        parentId: dev.id,
      });
      return {
        status: 1,
        data: dev,
        message: `委员会成员单位创建成功，单位名称：${companyName}`,
      };
    } else {
      return {
        status: 0,
        message: '初始化数据异常，请联系管理员',
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
          const { name, tag, desc, orderIndex } = request.body;
          switch (tag) {
            case departmentTag.委员会管理员:
              return await this.createWYH(name, desc, orderIndex);
            case departmentTag.评定决定员:
              return await this.createWYHPDJDY(name, desc, orderIndex);
            case departmentTag.项目管理员:
              return await this.createPSJG(name, desc, orderIndex);
            case departmentTag.审核员:
              return await this.createSHY(name, desc, orderIndex);
            default:
              return {
                status: 0,
                message: '部门类型不在允许范围内',
              };
          }
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
