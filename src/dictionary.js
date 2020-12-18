const path = require('path');

module.exports = {
  // 用户级别
  'userLevel': {
    'admin': 0, // 管理员
    'leader': 1, // 领导
    'user': 2, // 普通用户
  },
  // 论文类型
  'thesisType': {
    'sci': 0, // SCI/C刊
    'sci1': 1, // SCI一区
    'sci2': 2, // SCI二区
  },
  'export': {
    'savePath': path.resolve(__dirname, `../export_target/`), // 导出文件保存路径
    'user': {
      'college': '所在单位',
      'enter_level': '人才层次',
      'name': '姓名',
    },
    'base': {
      'num': '人员代码',
      'college': '所在单位',
      'enter_level': '人才层次',
      'name': '姓名',
      'sex': '性别',
      'political_outlook': '政治面貌',
      'birthday': '出生年月',
      'native_place': '籍贯',
      'enter_date': '入校/选/站时间',
      'title': '职称',
      'review_time': '评审时间',
      'Dr_school': '毕业学校',
      'Dr_major': '博士专业',
      'graduation_date': '博士毕业',
      'Dr_tutor_name': '博导姓名',
      'Dr_tutor_title': '博导称号',
      'overseas': '海外经历',
      'overseas_time': '经历时限',
      'overseas_Dr': '海外博士',
      'after_Dr': '博后经历',
      'settling_in_allowance': '安家费',
      'scientific_research_funds': '科研经费',
      'lab_construction_fee': '实验经费',
      'housing': '住房',
      'housing_subsidies': '购房补贴',
      'makeshift_house': '过渡住房',
      'scientific_research_house': '科研用房',
      'title_tp': '职称特评',
      'spouse_work': '配偶工作',
      'settling_in_allowance__r': '安家费',
      'scientific_research_funds__r': '科研经费',
      'lab_construction_fee__r': '实验室建设费',
      'housing__r': '住房',
      'housing_date__r': '住房分配时间',
      'housing_subsidies__r': '购房补贴',
      'makeshift_house__r': '过渡住房',
      'makeshift_house_date__r': '过渡住房分配时间',
      'scientific_research_house__r': '科研用房',
      'srh_date__r': '科研用房分配时间',
      'spouse_work__r': '配偶工作',
      'spouse_work_date__r': '配偶工作安排时间',
      'sum': '总数',
      'sci': 'SCI/C刊',
      'sci1': 'SCI一区',
      'sci2': 'SCI二区',
      'qj_date': '青基时限',
      'ms_date': '面上时限',
      'jfze': '项目经费',
      'sbrcch': '申报人才称号',
      'tjrc': '推荐人才',
      'hjqk': '获奖',
    },
    'thesis_r': {
      'num': '人员代码',
      'zzbm': '作者部门',
      'zzbx': '作者排序',
      'zzxnpx': '作者校内排序',
      'tj_year': '提交年度',
      'lx': '类型',
      'lwmc': '论文名称',
      'fbqk': '发表期刊',
      'zz': '作者',
      'fbsj': '发表时间',
      'j': '卷',
      'slqk': '收录情况',
      'q': '期',
      'gwhxqk': '国外核心期刊',
      'gwybqk': '国外一般期刊',
      'txzz': '通讯作者',
      'gnzyqk': '国内重要期刊',
      'dyzz': '第一作者',
      'dyzz_zjxs': '第一作者是否为在籍学生',
      'zyqkzbdw': '重要期刊主办单位',
      'xsxh': '学生学号',
      'xsxm': '学生姓名',
      'gwqtkw': '国外其他刊物',
      'lwlx': '论文类型',
      'cssci_kyqk': 'CSSCI刊源期刊',
      'gnzwhxqk': '国内中文核心期刊',
      'cscd_kyqk': 'CSCD刊源期刊',
      'issn': 'ISSN',
      'zeng_zheng': '增刊还是正刊',
      'yy': '语言',
      'yxyz': '影响因子',
      'remark': '备注',
    },
    'project_r': {
      'num': '人员代码',
      'ssxb': '所属系部',
      'fzr': '负责人',
      'xmlx': '项目类型',
      'lxnd': '立项年度',
      'xmxh': '项目序号',
      'xmmc': '项目名称',
      'xmbh': '项目编号',
      'xmzjly': '项目直接来源',
      'xmjb': '项目级别',
      'lxpzje': '立项批准金额',
      'remark': '备注',
    },
    'other_r': {
      'num': '人员代码',
      'xmjf': '项目经费',
      'sbrcch': '申报人才称号',
      'tjrc': '推荐人才',
      'remark': '备注',
    },
  },
  'upload': {
    'savePath': path.resolve(__dirname, `../upload/`), // 上传文件保存路径
  },
}
;
