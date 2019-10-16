import store from '../store/index'
const rolesObj = {
    'manage-1010': '审核',
    'manage-1020': '充值',
    'manage-1030': '删除',
    'manage-1040': '子账户管理',
    'manage-2010': '一级审批',
    'manage-2020': '二级审批',
    'manage-2030': '改价',
    'manage-3010': '角色管理',
    'manage-3020': '用户管理'

}
//控制按钮
export function rolesButton(btnName) {
    let rolesList = []
    for (let item of store.getters.roles) {
        if (rolesObj[item]) {
            rolesList.push(rolesObj[item])
        }
    }
    return !rolesList.includes(btnName)
}
//控制按钮颜色
export function rolesButtonColor(btnName) {
    let rolesList = []
    for (let item of store.getters.roles) {
        if (rolesObj[item]) {
            rolesList.push(rolesObj[item])
        }
    }
    if (!rolesList.includes(btnName)) {
        return 'info'
    }
    return 'primary'
}

// '通信有效性评分': '1',
// '信贷信息统计': '2',
// '逾期雷达': '3',
// '身份欺诈风险识别': '4',

// '银行卡有效性鉴定': '5',
// '万象分': '6',
// '司法风险画像': '7',


// '账户欺诈三维风险识别': '4',
// '账户欺诈四维风险识别': '8',
// '通信欺诈三维风险识别': '9',
//数据源列表icon
const dsObj = {
    '司法风险画像': '1',
    '信贷信息统计': '2',
    '逾期雷达': '3',
    '账户欺诈三维风险识别': '4',
    '银行卡有效性鉴定': '5',
    '身份欺诈风险识别': '6',
    '万象分': '7',
    '账户欺诈四维风险识别': '8',
    '通信欺诈三维风险识别': '9',
    '通信有效性评分': '10'

}

//数据源列表icon
export function dsListIcon(dsName) {
    if (dsObj[dsName]) {
        return require('@/assets/img/' + dsObj[dsName] + '.png')
    }
    return '../../../assets/img/1.png'
}

//时间格式转换
export function renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}