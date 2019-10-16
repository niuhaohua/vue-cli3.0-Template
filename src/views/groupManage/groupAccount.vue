<template>
  <div class="page-main">
    <add-account :get-list="getAccountList" />
    <modify-account :row-data="modifyData" :get-list="getAccountList" :flag="openFlag" />
    <reset-password
      :row-data="resetPasswordData"
      :get-list="getAccountList"
      :flag="resetPasswordOpenFlag"
    />
    <el-divider></el-divider>
    <div class="tableList">
      <el-table
        ref="filterTable"
        :data="accountList"
        style="width: 100%"
        :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
        cell-class-name="cell-class"
      >
        <el-table-column width="30px"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <div class="name">{{scope.row.userName}}</div>
          </template>
        </el-table-column>

        <el-table-column label="姓名">
          <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
          </template>
        </el-table-column>

        <el-table-column label="联系方式">
          <template slot-scope="scope">
            <div>{{scope.row.mobile}}</div>
          </template>
        </el-table-column>

        <el-table-column label="邮箱">
          <template slot-scope="scope">
            <div>{{scope.row.email}}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色" sortable>
          <template slot-scope="scope">
            <div>{{scope.row.roleName}}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-link :class="['mr', 'fs-12']" type="primary" @click="modify(scope.row)">修改</el-link>
            <el-link :class="['mr', 'fs-12']" type="primary" @click="resetPassword(scope.row)">重置密码</el-link>
            <el-link :class="['mr', 'fs-12']" type="primary" @click="deleted(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :total="total" :change-page="changePage" />
  </div>
</template>
<script>
import Pagination from '../../components/pagination/index'
import AddAccount from './components/addAccount'
import ModifyAccount from './components/modifyAccount'
import ResetPassword from './components/resetPassword'
export default {
  name: 'groupAccount',
  components: {
    Pagination,
    AddAccount,
    ModifyAccount,
    ResetPassword
  },
  data() {
    return {
      resetPasswordOpenFlag: true,
      resetPasswordData: {},
      openFlag: true,
      groupId: null,
      userId: null,
      page: 1,
      modifyData: {},
      total: 0,
      accountList: []
    }
  },
  mounted() {
    this.groupId = this.$route.query.id
    this.getAccountList()
  },
  methods: {
    modify(row) {
      this.modifyData = row
      this.openFlag = !this.openFlag
    },
    resetPassword(row) {
      this.resetPasswordData = row
      this.resetPasswordOpenFlag = !this.resetPasswordOpenFlag
    },
    //获取子账号列表
    getAccountList(page = 1) {
      this.$api.post('/userMeth/getUserListAndRole', { pageNum: page, pageSize: 10, insId: this.groupId }, res => {
        let data = res.data
        this.accountList = data.list
        this.total = data.total
      })
    },
    //点击分页
    changePage(page) {
      this.page = page
      this.getAccountList(page)
    },
    //重置密码

    //删除
    deleted(row) {
      this.$confirm('是否要删除“' + row.name + '”?删除以后将不能继续使用，请谨慎操作', '删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.$api.post('/userMeth/delUser', { userId: row.id }, res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getAccountList(this.page)
        })
      }).catch(() => {
      })
    },
  }
}
</script>
<style scoped>
.mr {
  margin-right: 24px;
}
</style>
<style >
.fs-12 {
  font-size: 12px !important;
}
</style>
