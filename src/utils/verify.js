const verify = {
    checkUserName: function (rule, value, callback) {
        let reg = /^[a-zA-Z0-9]{6,16}$/;
        //帐号是否合法(字母开头，允许5-16 字节,允许字母数字下划线)：^[a-zA-Z][a-zA-Z0-9_]{4,15}$
        if (reg.test(value) == false) {
            callback(new Error('用户名应为6-16为字母数字组合'))
        } else {
            callback()
        }
    },
    checkPassWord: function (rule, value, callback) {
        let reg = /^[a-zA-Z0-9]{6,16}$/;
        if (reg.test(value) == false) {
            callback(new Error('密码应为6-16为字母数字组合'))
        } else {
            callback()
        }
    },
    checkTelephone: function (rule, value, callback) {
        let reg = /^1[3456789]\d{9}$/;
        if (reg.test(value) == false) {
            callback(new Error('手机号码不符合要求，请重新输入'))
        } else {
            callback()
        }
    },
    checkIdentifyCode: function (rule, value, callback) {
        let reg = /^\d{6}$/;
        if (reg.test(value) == false) {
            callback(new Error('验证码不符合要求，请重新输入'))
        } else {
            callback()
        }
    },
    CheckChineseName: function (rule, value, callback) {
        let reg = /^[\u4E00-\u9FA5]{2,5}$/;
        if (reg.test(value) == false) {
            callback(new Error('真实姓名应为2-5位中文'))
        } else {
            callback()
        }
    },
    checkCompanyName: function (rule, value, callback) {
        let reg = /^[\u4E00-\u9FA5（）/(/)]{3,30}$/;
        if (reg.test(value) == false) {
            callback(new Error('公司名称应为3-30位中文'))
        } else {
            callback()
        }
    },
    checkEmail: function (rule, value, callback) {
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if (reg.test(value) == false) {
            callback(new Error('邮箱格式不符合要求，请重新输入'))
        } else {
            callback()
        }
    },
}
export default verify