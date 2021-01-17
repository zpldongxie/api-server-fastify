/*
 * @description: 路由用到的方法
 * @author: zpl
 * @Date: 2021-01-12 09:47:22
 * @LastEditTime: 2021-01-17 20:55:52
 * @LastEditors: zpl
 */
const { Op } = require('sequelize');
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
   * @param {*} Model
   * @param {*} ajv
   * @memberof Method
   */
  constructor(Model, ajv) {
    super(Model, ajv);
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
          const {
            config: {
              ChannelModel, ArticleExtensionModel,
            },
          } = reply.context;
          const id = request.params.id;
          const include = [
            {
              model: ChannelModel,
              attributes: ['id', 'name'],
            },
            {
              model: ArticleExtensionModel,
              attributes: ['id', 'title', 'info', 'remark'],
            },
          ];
          const res = await that.dbMethod.findById(id, include);
          return res;
        },
    );
  }

  /**
   * 根据ID获取单个
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async findOne(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            config: {
              ChannelModel, ArticleExtensionModel,
            },
          } = reply.context;
          const where = request.params;
          const include = [
            {
              model: ChannelModel,
              attributes: ['id', 'name'],
            },
            {
              model: ArticleExtensionModel,
              attributes: ['id', 'title', 'info', 'remark'],
            },
          ];
          const res = await that.dbMethod.findOne({ where, include });
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
          const {
            config: {
              ChannelModel, ArticleExtensionModel,
            },
          } = reply.context;
          const conditions = {
            attributes: {
              exclude: ['mainCon'],
            },
            include: [
              {
                model: ChannelModel,
                attributes: ['id', 'name'],
              },
              {
                model: ArticleExtensionModel,
                attributes: ['id', 'title', 'info', 'remark'],
              },
            ],
          };
          const res = await that.dbMethod.findAll(conditions);
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
          const { config: { ChannelModel, ArticleExtensionModel } } = reply.context;
          const {
            current,
            pageSize,
            sorter = {},
            filter,
            channelId,
            ...where
          } = request.body;

          if (!where.hasOwnProperty('pubStatus')) {
            where.pubStatus = { [Op.not]: '已删除' };
          }
          if (!sorter.hasOwnProperty('conDate')) {
            sorter.conDate = 'desc';
          }
          const attributes = {
            exclude: ['mainCon'],
          };
          const include = [
            {
              model: ChannelModel,
              attributes: ['id', 'name'],
            },
            {
              model: ArticleExtensionModel,
              attributes: ['id', 'title', 'info', 'remark'],
            },
          ];
          if (channelId) {
            include[0].where = {
              id: channelId,
            };
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
          const res = await that.dbMethod.create(request.body);
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
          const { id } = request.body;
          const res = await that.dbMethod.updateOne(id, request.body);
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
    await (that.run(request, reply))(
        async () => {
          const { config: { channelDBMethod, articleExtensionDBMethod } } = reply.context;
          const params = {
            approvalStatus: '无需审核',
            pubStatus: '草稿',
            ...request.body,
          };
          const res = {};
          const result = await that.dbMethod.upsert(params);
          const cResult = await channelDBMethod.queryList({ where: { id: { [Op.in]: params.Channels } } }, true);
          if (!!result.status) {
            const article = result.data;
            const eResult = await articleExtensionDBMethod.queryList({ where: { ArticleId: article.id } });
            if (eResult.status) {
              articleExtensionDBMethod.delete(eResult.data.list.map((e)=>e.id));
            }
            const articleExtensions = request.body.ArticleExtensions || [];
            for (let i = 0; i < articleExtensions.length; i++) {
              const extension = articleExtensions[i];
              await articleExtensionDBMethod.upsert({ ...extension, ArticleId: article.id });
            }
            if (cResult.status) {
              await article.setChannels(cResult.data.list.map((c)=>c.id));
            }
            res.status = 1;
            return {
              status: 1,
              data: article,
            };
            // onRouterSuccess(reply, article);
          } else {
            return {
              status: 0,
              message: '保存失败',
            };
            // onRouterError(reply, '保存失败');
          }
        },
    );
  }

  /**
   * 批量移动文章
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async moveTo(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const {
            config: {
              channelDBMethod,
            },
          } = reply.context;
          const { ids, cIds } = request.body;
          // TODO: 没有做栏目类型校验
          const aResult = await that.dbMethod.queryList({ where: { id: { [Op.in]: ids } } });
          const cResult = await channelDBMethod.queryList({ where: { id: { [Op.in]: cIds } } }, true);
          if (aResult.status && cResult.status) {
            const channelIds = cResult.data.list.map((c)=>c.id);
            const articles = aResult.data.list;
            for (let i = 0; i < articles.length; i++) {
              const article = articles[i];
              await article.setChannels(channelIds);
            }
            return {
              status: 1,
            };
            // onRouterSuccess(reply);
          } else {
            return {
              status: 0,
              message: '所选栏目无效',
            };
            // onRouterError(reply, '所选栏目无效');
          }
        },
    );
  }

  /**
   * 批量设置文章属性
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async setAttr(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { ids, attr } = request.body;
          const res = await that.dbMethod.updateMany(ids, attr);
          return res;
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

  /**
   * 查找无归属文章
   *
   * @param {*} request
   * @param {*} reply
   * @memberof Method
   */
  async findNoAttributionArticle(request, reply) {
    const that = this;
    await (that.run(request, reply))(
        async () => {
          const { config: { ChannelModel } } = reply.context;
          const conditions = {
            attributes: {
              exclude: ['mainCon'],
            },
            include: [{
              model: ChannelModel,
              attributes: ['id', 'name'],
            }],
          };
          const res = await that.dbMethod.findAll(conditions);
          const { status } = res;
          if (status) {
            const articles = aResult.data;
            const list = articles.filter((article) => !article.Channels || !article.Channels.length);
            return {
              status: 1,
              data: { total: list.length, list },
            };
            // onRouterSuccess(reply, { total: list.length, list });
          } else {
            return {
              status: 0,
              message: '所选栏目无效',
            };
            // onRouterError(reply, '所选栏目无效');
          }
        },
    );
  }
}

module.exports = Method;
