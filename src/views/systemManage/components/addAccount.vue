<template>
  <div class="add-account-box">
    <el-button
      class="add-account"
      type="primary"
      icon="el-icon-plus"
      @click="dialogFormVisible = true"
    >新增账户</el-button>
    <el-dialog class="dialog" title="添加账号" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="passWd" :label-width="formLabelWidth">
          <el-input v-model="form.passWd" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确定登录密码" prop="passWdAgain" :label-width="formLabelWidth">
          <el-input v-model="form.passWdAgain"  type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
  name: 'addAccount',
  props: {
    rolesList: {
      type: Array,
      required: []
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
        name: '',
        passWd: '',
        passWdAgain: '',
        roleId: ''
      },
      formLabelWidth: '110px',
      rules: {
        userName: [
          { required: true, validator: verify.checkUserName, trigger: 'blur' },
        ],
        passWd: [
          { required: true, validator: verify.checkPassWord, trigger: 'blur' },
        ],
        passWdAgain: [
          { required: true, validator: passAgainCheck, trigger: 'blur' },
        ],
        // name: [
        //   { required: true, validator: verify.CheckChineseName, trigger: 'blur' }
        // ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
      },
    }

  },
  watch: {
    rolesList: {
      handler(newData, oldData) {
        this.rolesList = newData
        return
      },
      immediate: true,
      deep: true
    },
  },
  mounted() {
  },
  methods: {
    //提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.id) {
            this.form.id = this.id
          }
          this.$api.post('/userMeth/addUser', this.form, res => {
            this.$message({
              message: '账号添加成功',
              type: 'success'
            });
            this.getList()
          })
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
.add-account-box .el-form-item__label {
  width: 110px;
  text-align: right;
}

.el-dialog__header {
  padding: 20px 20px 0;
}
.add-account-box .el-dialog {
  width: 402px !important;
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

.add-account-box .el-input__icon {
  line-height: 28px !important;
}

.add-account-box .select-box {
  margin-top: 45px;
}
.add-account-box .select-label {
  display: inline-block;
  width: 110px;
  text-align: right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 17px;
  vertical-align: top;
  padding-right: 10px;
  box-sizing: border-box;
}
.add-account-box .select-label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.add-account-box .el-tree {
  /* display: inline-block; */
  padding-left: 86px;
  padding-top: 10px;
}
.add-account-box .el-tree .el-tree-node__content {
  height: 35px;
}
</style>
