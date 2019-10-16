<template>
  <div class="bg">
    <top-header />
    <div class="logo">
      <img src="../assets/img/denglu_logo.png" alt />
    </div>
    <div class="login-form">
      <div class="usermessage">
        <ul>
          <li>
            <input
              type="text"
              v-model="loginform.username"
              name="username"
              autocomplete="off"
              class="username"
              placeholder="账户：6-16位英文或数字"
              @blur="checkUserName($event)"
              @focus="cancelWarn($event)"
            />
            <span>{{ warn.username }}</span>
          </li>
          <li>
            <input
              type="password"
              v-model="loginform.password"
              name="password"
              class="password"
              placeholder="密码：6-16位英文或数字"
              @blur="checkPassWord($event)"
              @focus="cancelWarn($event)"
            />
            <span>{{ warn.password }}</span>
          </li>
        </ul>
        <div class="buttonarea">
          <span class="caution">{{ caution }}</span>
          <button @click="submitForm($event)" class="loginbutton">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formverify } from '../assets/js/formverify.js';
// import { AUTH_USER } from "../assets/js";
import { getToken, setToken, removeToken } from '../utils/token'
import router, { resetRouter } from '../router/router'
import store from "../store/index";
import TopHeader from "@/components/HeaderNav/index";
export default {
  name: "Login",
  components: {
    TopHeader
  },
  data() {
    return {
      loginform: {
        username: "",
        password: ""
      },
      warn: {
        username: "",
        password: "",
      },
      caution: '',
      verification: [false, false]
    }
  },
  methods: {
    checkUserName() {
      let value = this.loginform.username;
      if (value == "" || value == null) {
        this.warn.username = "用户名不能为空";
      } else {
        let verifyVal = formverify.checkusername(value, this.warn);
        this.verification[0] = verifyVal;
      }
    },
    checkPassWord() {
      let value = this.loginform.password;
      if (value == "" || value == null) {
        this.warn.password = "密码不能为空";
      } else {
        let verifyVal = formverify.checkpassword(value, this.warn);
        this.verification[1] = verifyVal;
      }
    },
    cancelWarn(event) {
      this.warn[event.target.name] = ''
    },
    checkNotNull() {
      if (this.loginform.username == '') {
        this.warn.username = '用户名不能为空';
      }
      if (this.loginform.password == '') {
        this.warn.password = '密码不能为空';
      }
    },
    submitForm(event) {
      let that = this;
      this.checkNotNull();
      if (this.verification.includes(false) == true) {
        return false;
      }

      let params = {
        userName: this.loginform.username,
        passwd: this.loginform.password
      };
      this.$api.post('/loginCheck', params, (res) => {
        setToken('ht-token', res.data.access_token)
        setToken('ht-refreshtoken', res.data.refresh_token)
        setToken('ht-userInfo', JSON.stringify(res.data))
        this.$router.push({ path: "/dsList" });
      }, () => {

      })

    }

  }
}

</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background: #ecf0f1;
  padding-top: 262px;
  box-sizing: border-box;
}
.logo {
  text-align: center;
  margin-bottom: 60px;
}
.login-form {
  text-align: center;
}
.usermessage {
  display: inline-block;
  text-align: left;
}
.usermessage li {
  height: 75px;
}

.usermessage .username,
.usermessage .password {
  display: block;
  width: 368px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding-left: 36px;
}

.usermessage .username {
  background: url("../assets/img/Group 15.png") no-repeat 15px center #ffffff;
}

.usermessage .password {
  background: url("../assets/img/Group 16.png") no-repeat 15px center #ffffff;
}

.usermessage input[type="text"]:focus,
.usermessage input[type="password"]:focus {
  border: 1px solid #5e97f0;
  outline: 0;
}

.usermessage span {
  font-size: 12px;
  color: #f00;
}

.usermessage .buttonarea {
  height: 90px;
}

.usermessage .buttonarea span {
  height: 25px;
  line-height: 25px;
}

.usermessage .loginbutton {
  background: #5e97f0;
  border-radius: 4px;
  width: 368px;
  height: 40px;
  display: block;
  border: 0px;
  color: #fff;
  outline: 0;
  cursor: pointer;
}
</style>
