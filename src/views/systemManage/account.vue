<template>
  <div class="page-main account">
    <add-account :roles-list="options" :get-list="getAccountList" />

    <el-divider></el-divider>
    <div class="input-box">
      <el-input v-model="input" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
    </div>

    <div class="tableList">
      <el-table
        v-loading="loading"
        ref="filterTable"
        :data="accountList"
        style="width: 100%"
        :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
        cell-class-name="cell-class"
      >
        <el-table-column width="30px"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <div>{{scope.row.userName}}</div>
          </template>
        </el-table-column>

        <el-table-column label="姓名">
          <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色">
          <template slot-scope="scope">
            <div>{{scope.row.roleName}}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-link
              :class="['mr', 'fs-12']"
              type="primary"
              @click="modifyRoles(scope.$index,scope.row)"
            >修改</el-link>
            <el-link
              :class="['mr', 'fs-12']"
              type="primary"
              @click="modifyPass(scope.$index,scope.row)"
            >重置密码</el-link>
            <el-link
              :class="['mr', 'fs-12']"
              type="primary"
              @click="deleted(scope.$index,scope.row)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      class="dialog modify-roles"
      title="修改角色"
      :visible.sync="modifyRolesDialog"
      :close-on-click-modal="false"
    >
      <el-divider></el-divider>
      <el-form :model="modifyRolePamars" :rules="rules" ref="modifyRole">
        <el-form-item label="用户名" label-width="110px" :disabled="true">{{name}}</el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select v-model="modifyRolePamars.roles" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button type="primary" @click="submit('modifyRole')">确 定</el-button>
        <el-button @click="modifyRolesDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialog" title="修改密码" :visible.sync="modifyPassDialog">
      <el-divider></el-divider>
      <el-form :model="modifyPassPamars" :rules="rules" ref="modifyPass">
        <el-form-item label="用户名" prop="name" label-width="110px">{{name}}</el-form-item>

        <el-form-item label="登录密码" prop="pass" label-width="110px">
          <el-input v-model="modifyPassPamars.pass" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确定登录密码" prop="passAgain" label-width="110px">
          <el-input autocomplete="off" type="password" v-model="modifyPassPamars.passAgain"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button type="primary" @click="submit('modifyPass')">确 定</el-button>
        <el-button @click="modifyPassDialog = false">取 消</el-button>
      </div>
    </el-dialog>
     <Pagination :total="total" :change-page="changePage" />
  </div>
</template>
<script>
import AddAccount from './components/addAccount'
import Pagination from '../../components/pagination/index'
export default {
  name: 'account',
  components: {
    AddAccount,
    Pagination
  },
  data() {
    var passAgainCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.modifyPassPamars.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      total:0,
      page:1,
      loading: true,
      options: [],
      name: '',
      modifyRolesDialog: false,
      modifyPassDialog: false,
      accountId: null,
      index: '',
      accountList: [],
      modifyRolePamars: {
        roles: '',
      },
      modifyPassPamars: {
        pass: '',
        passAgain: '',

      },
      rules: {
        roles: [
          { required: true, message: '请输入角色', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        passAgain: [
          { validator: passAgainCheck, trigger: 'blur' }
        ],
      },
      input: ''
    }
  },
  mounted() {
    this.getRoleList()
    this.getAccountList(1)
  },
  methods: {
    //获取用户列表
    getAccountList(page) {
      this.loading = true
      this.$api.post('/user/list', {currentPage: page, pageSize: 10}, (res) => {
        this.total = res.data.count
        this.accountList = res.data.list
        this.loading = false
      }, (error) => {

      })
    },
    //点击分页
    changePage(page) {
      this.page = page
      this.getAccountList(page)
    },
    //实时查询
    // input() {

    // },
    modifyRoles(index, row) {
      this.modifyRolesDialog = true
      this.name = row.name
      this.modifyRolePamars.roles = ''
      this.index = index
      this.accountId = row.id
    },
    modifyPass(index, row) {
      this.modifyPassDialog = true
      this.name = row.name
      this.index = index
      this.accountId = row.id
    },

    //提交修改
    submit(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          let pamars = {}
          if (ref === 'modifyPass') {
            pamars = { id: this.accountId, passWd: this.modifyPassPamars.passAgain }
          } else {
            pamars = { id: this.accountId, roleId: this.modifyRolePamars.roles }
          }
          this.$api.post('/user/addOrEdit', pamars, res => {
            this.$message({
              message: ref === 'modifyPass' ? '密码修改成功' : '账号修改成功',
              type: 'success'
            });
            this.modifyRolesDialog = false
            this.modifyPassDialog = false
            this.getAccountList()
          })
        }
      });
    },

    //删除
    deleted(index, row) {
      this.$confirm('是否确认删除?', row.name, {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'cancelButtonClass',
        center: true
      }).then(() => {
        this.$api.post('/user/delete', { userId: row.id }, res => {
          this.$message({
            message: '账号删除成功',
            type: 'success'
          });
        })
        this.getAccountList()
      }).catch(() => {
      })
    },
    //获取角色列表
    getRoleList() {
      this.$api.post('/role/list', {}, res => {
        this.options = res.data.list
      })
    },

  }
}
</script>
<style scoped>
.mr {
  margin-right: 24px;
}
.add-account {
  height: 28px;
  width: 88px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
}

.input-box {
  width: 194px;
  padding-right: 32px;
  padding-bottom: 20px;
}
.input-box .el-input__inner {
  height: 28px;
  font-size: 12px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.input-box .el-input__suffix-inner {
  pointer-events: all;
  position: relative;
  top: -5px;
}
</style>
<style >
.account .el-input {
  width: 200px;
}
.account .el-input .el-input__inner {
  width: 100%;
  height: 28px !important;
  line-height: 28px !important;
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  font-size: 12px;
}
.account .el-form-item {
  margin-bottom: 16px;
}
.account .el-form-item__error {
  padding-top: 0px;
  font-size: 10px;
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

.account .el-form-item__label,
.account .el-form-item__content {
  height: 28px;
  line-height: 28px;
}
.account .el-form-item__label {
  width: 110px;
  text-align: right;
}

.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog__body {
  padding: 0 20px;
}
.account .el-dialog {
  width: 402px !important;
}
.account .el-dialog__body {
  padding: 0 20px;
}
.account .el-dialog__body {
  padding-top: 0;
}
.account .dialog .el-divider--horizontal {
  margin-bottom: 10px;
  margin-top: 10px;
}
.account .el-form {
  padding-top: 20px;
}
.account .el-dialog__footer {
  padding: 1px 20px 10px;
  text-align: right;
}
.account .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}

.account .el-input__icon {
  line-height: 28px !important;
}

.fs-12 {
  font-size: 12px !important;
}

.group-list-table .el-button {
}

.account .modify-roles .el-form-item__error {
  left: 110px;
}
</style>