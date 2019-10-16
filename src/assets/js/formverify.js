const formverify = {
   checkusername: function(value, message){
       let reg = /^[a-zA-Z0-9]{6,16}$/;
       if(reg.test(value) == false){
           message.username = '用户名不符合要求，请重新输入';
           return false;
       }
       return true;
   },
   checkpassword: function(value, message){
       let reg = /^[a-zA-Z0-9]{6,16}$/;
       if(reg.test(value) == false){
           message.password = '密码不符合要求，请重新输入';
           return false;
       }
       return true;
   },
   checktelephone: function(value, message){
       let reg =  /^1[3456789]\d{9}$/;
       if(reg.test(value) == false){
           message.telephone = '手机号码不符合要求，请重新输入';
           return false;
       }
       return true;
   },
   checkidentifycode: function(value, message){
       let reg =  /^\d{6}$/;
       if(reg.test(value) == false){
           message.checkcode = '验证码不符合要求，请重新输入';
           return false;
       }
       return true;
   },
   checkrealname: function(value, message){
       let reg = /^[\u4E00-\u9FA5]{2,4}$/;
       if(reg.test(value) == false){
           message.realname = '真实姓名不符合要求，请重新输入';
           return false;
       }
       return true;
   },
   checkcompanyname: function(value, message){
        let reg = /^[\u4E00-\u9FA5（）/(/)]{3,20}$/;
        if(reg.test(value) == false){
            message.companyname = '公司名称不符合要求，请重新输入';
            return false;
        }
        return true;
   },
   checkidcard: function(value, message){
       let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
       if(reg.test(value) == false){
           message.idcard = '身份证不符合要求，请重新输入';
           return false;
       }
       return true;

   },

    // zq 我的验证方式不同，表单是v-for生成的
    BackAccount: function (bankno, message) { // 校验银行卡号


        // let lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        // let first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        // let newArr = [];
        // for (let i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        //     newArr.push(first15Num.substr(i, 1));
        // }
        // let arrJiShu = []; //奇数位*2的积 <9
        // let arrJiShu2 = []; //奇数位*2的积 >9
        // let arrOuShu = []; //偶数位数组
        // for (let j = 0; j < newArr.length; j++) {
        //     if ((j + 1) % 2 == 1) { //奇数位
        //         if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
        //         else arrJiShu2.push(parseInt(newArr[j]) * 2);
        //     } else //偶数位
        //         arrOuShu.push(newArr[j]);
        // }
        //
        // let jishu_child1 = []; //奇数位*2 >9 的分割之后的数组个位数
        // let jishu_child2 = []; //奇数位*2 >9 的分割之后的数组十位数
        // for (let h = 0; h < arrJiShu2.length; h++) {
        //     jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        //     jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        // }
        //
        // let sumJiShu = 0; //奇数位*2 < 9 的数组之和
        // let sumOuShu = 0; //偶数位数组之和
        // let sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        // let sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        // let sumTotal = 0;
        // for (let m = 0; m < arrJiShu.length; m++) {
        //     sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        // }
        //
        // for (let n = 0; n < arrOuShu.length; n++) {
        //     sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        // }
        //
        // for (let p = 0; p < jishu_child1.length; p++) {
        //     sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        //     sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        // }
        // //计算总和
        // sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        //
        // //计算luhn值
        // let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        // let luhn = 10 - k;
        // if (lastNum == luhn) {
        //   message.err = ''
        //   return true;
        // } else {
        //   message.err = '请填写正确的银行卡号';
        //   return false;
        // }

      let reg = /^[0-9]*$/;

      if (reg.test(bankno) == false) {
        message.err = '请填写正确的银行卡号';
        return false;
      }
      message.err = '';
      return true;

    },
    TelAndPhone: function (value, message) { //只要是数字
        let reg = /^[0-9]*$/;
        if(reg.test(value) == false){
            message.err = '请输入数字';
            return false;
        }
        message.err = '';
        return true;
    },
    companyTFN: function (value, message) {
        let reg = /^\d{15}|\d{17}|\d{18}|\d{20}$/;
        if(reg.test(value) == false){
            message.err = '请输入15,17,18,20位的数字';
            return false;
        }
        message.err = '';
        return true;
    },
    companyTitle: function (value, message) {
        let reg = /^[\u4E00-\u9FA5（）/(/)]{3,50}$/;
        if(reg.test(value) == false){
            message.err = '公司名称不符合要求，请重新输入';
            return false;
        }
        message.err = '';
        return true;
    },
    PAT: function (value, message) {
        let reg = /^1(3|4|5|7|8)\d{9}$|^0\d{2,3}-?\d{7,8}$/;
        if(reg.test(value) == false){
            message.err = '请输入正确的电话号码或手机号';
            return false;
        }
        message.err = '';
        return true;
    },
    postcode: function (value, message) {
        let reg = /^[1-9][0-9]{5}$/;
        if(reg.test(value) == false){
            message.err = '请输入正确的邮政编码';
            return false;
        }
        message.err = '';
        return true;
    },
    chineseName: function (value, message) {
        let reg = /^[\u4E00-\u9FA5]{2,4}$/;
        if(reg.test(value) == false){
            message.err = '真实姓名不符合要求';
            return false;
        }
        message.err = '';
        return true;
    },
    examineIdCard: function (value, message) {
        let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
        if(reg.test(value) == false){
            message.err = '身份证不符合要求';
            return false;
        }
        message.err = '';
        return true;
    },
    examinePhone: function (value, message) {
        let reg =  /^1[34578]\d{9}$/;
        if(reg.test(value) == false){
            message.err = '手机号码不符合要求';
            return false;
        }
        message.err = '';
        return true;
    }
};



export { formverify }
