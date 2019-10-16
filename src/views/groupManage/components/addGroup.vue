<template>
  <div class="add-group-box">
    <el-button class="add-group" type="primary" icon="el-icon-plus" @click="open">添加机构</el-button>
    <el-dialog class="dialog" title="添加机构" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-divider></el-divider>
      <el-form :model="form" :rules="rules" ref="form">
        <div class="left">
          <el-form-item label="账户" prop="userName" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="账户密码" prop="passWd" :label-width="formLabelWidth">
            <el-input v-model="form.passWd" type="password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="请确认密码" prop="passWdAgain" :label-width="formLabelWidth">
            <el-input v-model="form.passWdAgain" type="password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>

          <!-- <el-form-item label="验证码" prop="verifyCode" :label-width="formLabelWidth">
            <el-input
              v-model="form.verifyCode"
              autocomplete="off"
              class="code"
              style="width:120px !important"
            ></el-input>
            <el-button class="get-code" @click.prevent="getCode()">{{codeText}}</el-button>
          </el-form-item> -->
        </div>
        <div class="right">
          <el-form-item label="机构名称" prop="insName" :label-width="formLabelWidth">
            <el-input v-model="form.insName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form>
            <el-form-item label="授权文件" prop="name" :label-width="formLabelWidth">
              <template>
                <Upload :success="upLoadSuccess" />
              </template>
            </el-form-item>
          </el-form>
        </div>
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
import Upload from './upload'
import verify from '../../../utils/verify'
import { timingSafeEqual } from 'crypto';
export default {
  name: 'addGroup',
  components: {
    Upload,
  },
  props: {
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
        insName: '',
        name: '',
        userName: '',
        passWd: '',
        passWdAgain: '',
        mobile: '',
        email: '',
        imgUrl: '',
        registerType:2
      },
      formLabelWidth: '110px',
      rules: {
        userName: [
          { required: true,max:20, validator: verify.checkUserName, trigger: 'blur' },
        ],
        passWd: [
          { required: true,min:6,max:16, validator: verify.checkPassWord, trigger: 'blur' },
        ],
        passWdAgain: [
          { required: true, validator: passAgainCheck, trigger: 'blur' },
        ],
        name: [
          { required: true,max:5, validator: verify.CheckChineseName, trigger: 'blur' }
        ],
        insName: [
          { required: true,max:30, validator: verify.checkCompanyName, trigger: 'blur' },
        ],
        email: [
          { required: true, validator: verify.checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, validator: verify.checkTelephone, trigger: 'blur' }
        ],
       
      },
      fileList: [],
    }

  },
  mounted() {
  },
  methods: {
    open() {
      this.fileList = []
      this.form = {
        insName: '',
        name: '',
        userName: '',
        passWd: '',
        passWdAgain: '',
        mobile: '',
        email: '',
        imgUrl: '',
        registerType:2
      }
      //  this.$refs['form'].resetFields()
      this.dialogFormVisible = true
    },
    upLoadSuccess(res, file, fileList) {
      this.fileList = fileList
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (this.fileList.length == 2) {
          this.form.imgUrl = this.fileList[0].response.path + ',' + this.fileList[1].response.path
          this.$api.post('/institution/registerInstitution', this.form, res => {
            this.dialogFormVisible = false
            this.$message({
              message: '机构添加成功',
              type: 'success'
            })
            this.getList()
          })
        } else {
          this.$message({
            message: '请上传正确的授权文件和营业执照原照',
            type: 'warning'
          });
        }
      })
    }
  }
}
</script>
<style scoped>
.add-group {
  height: 28px;
  width: 88px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
}
.left,
.right {
  display: inline-block;
  width: 50%;
  vertical-align: top;
}
</style>
<style >
.add-group-box .el-input .el-input__inner {
  width: 100% !important;
  height: 28px !important;
  line-height: 28px !important;
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  font-size: 12px;
}
.add-group-box .el-form-item {
  margin-bottom: 16px;
}
.add-group-box .el-form-item__error {
  padding-top: 0px;
  font-size: 10px;
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

.add-group-box .el-form-item__label,
.add-group-box .el-form-item__content {
  height: 28px;
  line-height: 28px;
}
.add-group-box .el-form-item__content {
  width: 200px;
}
.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog__body {
  padding: 0 20px;
}
.add-group-box .el-dialog {
  width: 732px !important;
}
.add-group-box .el-dialog__footer {
  padding: 1px 20px 10px;
  text-align: right;
}
.add-group-box .el-dialog__footer .el-divider--horizontal {
  margin-bottom: 10px;
}
.add-group-box .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}
.add-group-box .get-code {
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
.add-group-box .get-code:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>
