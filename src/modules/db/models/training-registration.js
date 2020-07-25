/*
 * @description: 安全培训报名管理
 * @author: zpl
 * @Date: 2020-07-21 18:31:33
 * @LastEditTime: 2020-07-23 18:39:49
 * @LastEditors: zpl
 */
const {Schema, model} = require('mongoose');

TrainingRegSchema = new Schema(
    {
      trainingId: Schema.Types.ObjectId, // 培训ID
      name: String, // 姓名
      mobile: Number, // 手机
      email: String, // 邮箱
      comp: String, // 公司名称
      registTime: Date, // 报名时间
      signInTime: Date, // 签到时间
    },
    {collection: 'training_registration'},
);

TrainingRegSchema.pre('save', async function() {
  this.updateTime = new Date();
  this.createTime = this.createTime || new Date();
});

module.exports = TrainingReg = model(
    'TrainingReg',
    TrainingRegSchema,
);
