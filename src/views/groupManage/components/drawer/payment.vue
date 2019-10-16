<template>
  <div class="recharge-two content">
    <div class="container" v-loading="alipayLoading">
      <div class="form-menu">
        <div>
          <label for class="title">充值金额：</label>
          <div class="radio-box">
            <span
              :class="{active:radioNum == index}"
              v-for="(item,index) in moneys"
              @click="selectMoney(index)"
            >{{item}}元</span>
          </div>
        </div>
        <div class="input-group">
          <label for class="title">其它金额：</label>
          <div class="input-box">
            <input
              type="tel"
              placeholder="充值金额不少于1000元的整数"
              v-model="inputMoney"
              @blur="blur()"
              @focus="focus()"
              @input="zInput()"
            />
            <!-- <label for="" class="error" v-if="error">{{errMsg}}</label>-->
          </div>
          <!--<label for="" class="hint"></label>-->
        </div>
        <div class="end-money">
          <label for class="title">支付金额：</label>
          <span class="money-num">{{endMoney | thousands}}</span>
          <span class="units">元</span>
        </div>

        <div class="modeOfPay">
          <!-- <label for class="title">支付方式：</label>
          <div class="select-modeOfPay">
            <a href="javascript:;" @click="alipay">
              <img src="../../../../assets/img/Alipay.png" alt="支付宝支付" />
              <span>支付宝支付</span>
            </a>
            <a href="javascript:;" @click="wxpay">
              <img src="../../../../assets/img/weixin.png" alt="微信支付" />
              <span>微信支付</span>
            </a>
          </div> -->
          <el-button type="primary" round @click="payment">点击充值</el-button>
        </div>
        <!-- <div class="hint">
          <div class="title">温馨提示：</div>
         <div><span>•</span>为了您的合法权益，转账时请备注您的注册手机号码以及充值账号</div>
          <div><span>•</span> 银行转账会需要至少3个工作日到账，期间请耐心等待，如果遇到问题可联系客服</div>
        </div> -->
      </div>
    </div>

    <!-- 支付宝支付弹窗 -->
    <el-dialog
      title
      width="400px"
      :visible.sync="alipayDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <div class="pay-tip">
          <p>请在新打开的页面中使用支付宝扫描二维码支付</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="small" @click="$router.push('/recharge')">支付遇到问题</el-button>
        <el-button size="small" type="primary" @click="$router.push('/recharge')">支付完成</el-button>
      </div>
    </el-dialog>

    <!-- 微信支付弹窗 -->
    <el-dialog
      title="微信支付"
      width="320px"
      :visible.sync="wxpayDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <div>
        <div class="wx-qrcode" v-loading="wxpayLoading">
          <img :src="wxQRCode" alt />
        </div>
        <div class="wxpay-tip">
          <p>请使用微信扫描二维码支付</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button style="width: auto;" size="small" @click="$router.push('/recharge')">支付遇到问题</el-button>
        <el-button
          style="width: auto;"
          size="small"
          type="primary"
          @click="$router.push('/recharge')"
        >支付完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import qs from 'qs';
import Bus from '../../../../utils/bus'
export default {
  name: "recharge-two",
  props:{
    id:{
      type:String,
      required:''
    }
  },
  data() {
    return {
      alipayLoading: false,       // 支付宝loading标识
      wxpayLoading: false,        // 微信loading标识
      alipayDialogVisible: false, // 支付宝弹窗显示标识
      wxpayDialogVisible: false, // 微信弹窗显示标识
      wxQRCode: '',
      moneys: [1000, 2000, 5000, 10000],
      inputMoney: '',
      endMoney: null,
      radioNum: null,
      error: false,
      errMsg: '',
      popName: null,
      url: ''
    }
  },
  methods: {
    selectMoney: function (index) {
      var This = this;
      This.radioNum = index;
      This.inputMoney = '';
      This.error = false;
      This.endMoney = This.moneys[index]
    },
    blur: function () {
      var This = this;
      setTimeout(function () {
        if (!This.inputMoney) {
          This.error = false;
          return;
        }
        if (This.inputMoney < 1000) {
          This.error = true;
          This.errMsg = '充值金额不少于1000元'
        } else if (!/^\d+$/.test(This.inputMoney)) {
          This.error = true;
          This.errMsg = '请输入整数'
        } else {
          This.error = false;
        }
      }, 100)
    },
    focus: function () {
      this.endMoney = null;
      this.radioNum = null;
    },
    zInput: function () {
      this.inputMoney = this.inputMoney.replace(/[^\d]/g, '');
      if (this.inputMoney.indexOf('0') == 0) {
        this.inputMoney = this.inputMoney.slice(1);
      }
      this.endMoney = this.inputMoney;
    },
    payment(){
      let This = this;
      if (this.endMoney == null || this.endMoney < 1000) {
        This.$message({
          message: '充值金额不少于1000元的整数',
          type: 'error',
          duration: 2000
        });
      } else {
        This.$api.post('/offline/setOffline',{amount: this.endMoney + '',paymentUniqueCode:this.id,creator:this.$store.state.user.name},res=>{
          this.$message({
          message: '充值成功',
          type: 'success',
        });
        Bus.$emit('on-paymentSuccess','success')
        })
      }
    },
    alipay() {
      let This = this;
      if (This.endMoney == null || This.endMoney < 1000) {
        This.$message({
          message: '充值金额不少于1000元的整数',
          type: 'error',
          duration: 2000
        });
      } else {
        This.alipayLoading = true;
        This.popName = '';
        This.$api.post('/accountRecharge/rechargeRecord',{amount: This.endMoney + ''},res=>{
          This.alipayLoading = false;
          if (res.code == 200) {
            if (res.data.resCode == '0000') {
              window.open(res.data.webForm, '_blank');
              This.alipayDialogVisible = true;
            } else {
              This.$message({
                message: res.data.resMsg,
                type: 'error',
                duration: 2000
              });
            }
          }
        })
      }
    },
    ifAlipay() { // 返回充值列表页
      this.$router.push({
        name: 'recharge',
      })
    },
    wxpay() {
      let _vm = this;
      if (_vm.endMoney == null || _vm.endMoney < 1000) {
        _vm.$message({
          message: '充值金额不少于1000元的整数',
          type: 'error',
          duration: 2000
        });
      } else {
        _vm.wxpayDialogVisible = true;
        _vm.wxpayLoading = true;
        axios({
          method: 'get',
          url: 'wxpay/pay?product_id=' + _vm.endMoney,
          responseType: 'blob',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        }).then(response => {
          _vm.wxpayLoading = false;
          let src = window.URL.createObjectURL(response.data);
          _vm.wxQRCode = src;
        }).catch(err => {
          _vm.wxpayLoading = false;
        })
      }
    },
   

  },
  filters: {
    thousands: function (value) {
      if (typeof value != 'object') {
        var tempArr = value.toString().split('').reverse();
        var endArr = [];
        tempArr.forEach(function (value, index) {
          if (index % 3 == 0) {
            endArr.push(',')
          }
          endArr.push(value);
        });
        endArr.shift();
        return endArr.reverse().join('');
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

label.error {
  font-size: 12px;
  color: red;
}


.container {
  background-color: #fff;
  border-radius: 5px;
  padding: 17px 32px 40px 25px;
}

.form-menu > div {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.form-menu > div .title {
  font-family: PingFangSC-Regular;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
}

.radio-box {
  margin-left: 16px;
}

.radio-box span {
  display: inline-block;
  width: 94px;
  height: 32px;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #bfbfbf;
  line-height: 32px;
  margin-right: 16px;
  cursor: pointer;
}

.radio-box span.active {
  background: #eaf1fd;
  border: 1px solid #5e97f0;
  border-radius: 4px;
  font-size: 14px;
  color: #5e97f0;
}

.input-box {
  margin-left: 12px;
  height: 32px;
  width: 328px;
}

.input-box input {
  width: 100%;
  height: 100%;
  outline: none;
  padding-left: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.input-group label.hint {
  font-size: 14px;
  color: #7f8fa4;
  margin-left: 9px;
}

.input-box input:focus {
  border-color: #3973fc;
}

.end-money {
  height: 45px;
  align-items: baseline;
}

.end-money .money-num {
  font-family: PingFangSC-Medium;
  font-size: 30px;
  color: #ffaa00;
  line-height: 22px;
  text-align: center;
  margin-left: 12px;
}

.units {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  top: 0px;
  margin-left: 4px;
}

.modeOfPay {
  align-items: flex-start;
}

.select-modeOfPay {
  margin-left: 12px;
}

.select-modeOfPay > a {
  width: 158px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-right: 16px;
  font-size: 16px;
  color: #354052;
}

.select-modeOfPay > a img {
  height: 24px;
  margin-right: 8px;
}

.form-menu > .hint {
  display: block;
  font-size: 12px;
  color: #7f8fa4;
  margin-top: 38px;
}

.form-menu > .hint .title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
  margin-bottom: 10px;
}
.form-menu > .hint div {
  font-size: 12px;
color: rgba(0,0,0,0.43);
}
.form-menu > .hint div span{
  margin-right: 3px;
}


.wx-qrcode {
  width: 100%;
  height: 240px;
}

.wx-qrcode img {
  width: 100%;
  height: auto;
}

.wxpay-tip {
  text-align: center;
}
</style>
