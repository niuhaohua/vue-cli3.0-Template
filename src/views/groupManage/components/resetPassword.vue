<template>
  <div class="resetPassword-box">
    <el-dialog class="dialog" title="修改密码" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-divider class="top-divider"></el-divider>
      <el-form :model="form" :rules="rules" ref="modifyPasswordForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <span>{{form.userName}}</span>
        </el-form-item>

        <el-form-item label="登录密码" prop="passWd" :label-width="formLabelWidth">
          <el-input v-model="form.passWd" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确定登录密码" prop="passWdAgain" :label-width="formLabelWidth">
          <el-input v-model="form.passWdAgain" type="password" autocomplete="off"></el-input>
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
import verify from '../../../utils/verify'
export default {
  name: 'resetPassword',
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
    var passAgainCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.passWd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        userName: '',
        id: null,
        passWd: '',
        passWdAgain: ''
      },
      formLabelWidth: '110px',
      rules: {
        passWd: [
          { required: true, validator: verify.checkPassWord, trigger: 'blur' },
        ],
        passWdAgain: [
          { required: true, validator: passAgainCheck, trigger: 'blur' },
        ],
      }

    }
  },
  watch: {
    rowData: {
      handler(newData, oldData) {
        if (newData && JSON.stringify(newData) !== '{}') {
          this.dialogFormVisible = true
          this.form.id = newData.id
          this.form.userName = newData.userName
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
  methods: {

    //修改子账号密码
    submit() {
      this.$refs['modifyPasswordForm'].validate((valid) => {
        if (valid) {
          this.$api.post('/userMeth/updateUser', {id:this.form.id,passWd:this.form.passWd}, res => {
            this.$message({
              message: '账号修改成功',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },

  }
}
</script>
<style >
.resetPassword-box .el-input {
  width: 200px;
}
.resetPassword-box .el-input .el-input__inner {
  width: 100%;
  height: 28px !important;
  line-height: 28px !important;
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  font-size: 12px;
}
.resetPassword-box.el-form-item {
  margin-bottom: 16px;
}
.resetPassword-box .el-form-item__error {
  padding-top: 0px;
  font-size: 10px;
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

.resetPassword-box .el-form-item__label,
.resetPassword-box .el-form-item__content {
  height: 28px;
  line-height: 28px;
}
.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog__body {
  padding: 0 20px;
}
.resetPassword-box .el-dialog {
  width: 402px !important;
}
.resetPassword-box .el-divider--horizontal {
  margin-bottom: 10px;
  margin-top: 20px;
}
.resetPassword-box .el-dialog__body .el-divider--horizontal {
  margin-bottom: 20px;
}
.resetPassword-box .el-dialog__footer {
  padding: 1px 20px 10px;
  text-align: right;
}
.resetPassword-box .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}

.resetPassword-box .el-input__icon {
  line-height: 28px !important;
}
</style>
