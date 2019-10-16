<template>
  <div class="add-account-box">
    <el-dialog class="dialog" title="修改账号" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-divider class="top-divider"></el-divider>
      <el-form :model="form" :rules="rules" ref="modifyAccountForm">
        <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
          <span>{{form.userName}}</span>
        </el-form-item>

        <el-form-item label="角色" prop="roleId" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="验证码" prop="verifyCode" :label-width="formLabelWidth">
          <el-input v-model="form.verifyCode" autocomplete="off" style="width:120px !important"></el-input>
          <el-button
            class="get-code"
            @click.prevent="getCode()"
            :disabled="codeText !== '获取验证码'"
          >{{codeText}}</el-button>
        </el-form-item> -->

        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import getCode from './getCode.js'
import { setInterval, clearInterval } from 'timers';
import verify from '../../../utils/verify'

export default {
  name: 'addAccount',
  components: {
  },
  props: {
    rowData: {
      type: Object,
      required: {}
    },
    flag: {
      type: Boolean,
    },
    getList: {
      type: Function
    }
  },
  data() {

    return {
      dialogFormVisible: false,
      rolesList: [],
      codeText: '获取验证码',
      noPassWd: true,
      title: '添加账号',
      form: {
        userName: '',
        name: '',
        mobile: '',
        email: '',
        roleId: '',
        // verifyCode: '',
        id: null,
      },
      formLabelWidth: '110px',
      rules: {
        name: [
          { required: true, validator: verify.CheckChineseName, trigger: 'blur' }
        ],
        eamil: [
          { required: true, validator: verify.checkEmail, trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: verify.checkTelephone, trigger: 'blur' }
        ],
        // verifyCode: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      }
    }

  },
  watch: {
    rowData: {
      handler(newData, oldData) {
        if (newData && JSON.stringify(newData) !== '{}') {
          this.dialogFormVisible = true
          for (let item in this.form) {
            this.form[item] = newData[item]
          }
        }
        return
      },
      immediate: true,
      deep: true
    },
    flag(newData, oldData) {
      this.dialogFormVisible = true
    }
  },
  mounted() {
    this.getRolesList(this.$route.query.id)
  },
  methods: {
    //获取角色列表
    getRolesList(id) {
      this.$api.post('/role/getRoleListByInsId', { insId: id }, res => {
        this.rolesList = res.data
      })
    },

    //修改子账号
    submit() {
      this.$refs['modifyAccountForm'].validate((valid) => {
        if (valid) {
          this.$api.post('/userMeth/updateUser', this.form, res => {
            this.$message({
              message: '账号修改成功',
              type: 'success'
            });
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    //获取验证码
    getCode() {
      verify.checkTelephone(null, this.form.mobile, (res) => {
        if (!res) {
          let num = 59
          let timer = setInterval(() => {
            this.codeText = num
            if (num != 0) {
              num--
            } else {
              this.codeText = '获取验证码'
              clearInterval(timer)
            }
          }, 1000)

          getCode({ phone: '18317890991' }).then(res => {
            this.$message({
              message: '验证码发送成功',
              type: 'success'
            });
          })
        } else {
          this.$message({
            message: '请输入正确格式的手机号',
            type: 'error'
          });
        }
      })
    }
  }
}
</script>
<style scoped>
.add-account {
  height: 28px;
  width: 88px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
}
</style>
<style >
.add-account-box .el-input {
  width: 200px;
}
.add-account-box .el-input .el-input__inner {
  width: 100%;
  height: 28px !important;
  line-height: 28px !important;
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  font-size: 12px;
}
.add-account-box .el-form-item {
  margin-bottom: 16px;
}
.add-account-box .el-form-item__error {
  padding-top: 0px;
  font-size: 10px;
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

.add-account-box .el-form-item__label,
.add-account-box .el-form-item__content {
  height: 28px;
  line-height: 28px;
}
.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog__body {
  padding: 0 20px;
}
.add-account-box .el-dialog {
  width: 402px !important;
}
.add-account-box .el-divider--horizontal {
  margin-bottom: 10px;
  margin-top: 20px;
}
.add-account-box .el-dialog__body .el-divider--horizontal {
  margin-bottom: 20px;
}
.add-account-box .el-dialog__footer {
  padding: 1px 20px 10px;
  text-align: right;
}
.add-account-box .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}
.add-account-box .get-code {
  width: 76px;
  height: 28px;
  padding: 0;
  text-align: center;
  background: #ffffff;
  border: 1px solid #5e97f0;
  border-radius: 4px;
  font-size: 12px;
  color: #5e97f0;
  line-height: 28px;
  margin-left: 4px;
}
.add-account-box .get-code:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.add-account-box .el-input__icon {
  line-height: 28px !important;
}
</style>
