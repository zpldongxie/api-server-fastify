/*
 * @description: 安全培训管理
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-07-23 11:38:09
 * @LastEditors: zpl
 */
const {Schema, model} = require('mongoose');

exports = TrainingSchema = new Schema(
    {
      title: String, // 培训标题
      subTitle: String, // 培训副标题
      typeByChannel: String, // 培训类型
      registStartTime: Date, // 报名开始时间
      registEndTime: Date, // 报名截止时间
      trainingMethod: String, // 培训方式
      startTime: Date, // 培训开始时间
      endTime: Date, // 培训结束时间
      desc: String, // 培训介绍
      updateTime: String, // 最后更新时间
      createTime: String, // 创建时间
    },
    {collection: 'training_management'},
);

TrainingSchema.pre('save', async function() {
  this.updateTime = new Date();
  this.createTime = this.createTime || new Date();
});

module.exports = Training = model(
    'Training',
    TrainingSchema,
);
