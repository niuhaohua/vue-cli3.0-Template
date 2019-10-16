<template>
  <div class="page-main">
    <add-group :get-list="addSuccess" />
    <el-divider></el-divider>
    <div class="tableList">
      <el-table
        v-loading="loading"
        ref="filterTable"
        :data="groupList"
        style="width: 100%"
        :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
        cell-class-name="cell-class"
      >
        <el-table-column width="30px"></el-table-column>

        <el-table-column label="机构名称">
          <template slot-scope="scope">
            <div class="name">{{scope.row.name}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">
              <span class="badge badge-wait"></span>未审核
            </span>
            <span v-if="scope.row.status === '1'">
              <span class="badge badge-success"></span>审核通过
            </span>
            <span v-if="scope.row.status === '2'">
              <span class="badge badge-refuse"></span>已拒绝
            </span>
          </template>
        </el-table-column>

        <el-table-column label="资质合同">
          <template slot-scope="scope">
            <span class="wt-15"></span>
            <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
              <span class="dl" @click="downLoad(scope.row)"></span>
            </el-tooltip>

            <!-- <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
              <span class="search"></span>
            </el-tooltip>-->
          </template>
        </el-table-column>
        <el-table-column label="机构余额">
          <template slot-scope="scope">
            <span v-if="scope.row.insAmount>=0">{{scope.row.insAmount}}元</span>
            <span v-if="scope.row.insAmount === null || scope.row.insAmount === 'null'">--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.status === '0'"
              :class="['fs-12']"
              :type="'审核' | rolesButtonColor"
              :disabled="'审核' | rolesButton"
              @click="shenhe(scope.$index, scope.row)"
            >审核</el-link>
            <el-link
              v-if="scope.row.status !== '0'"
              :class="['fs-12']"
              type="info"
              :disabled="true"
            >已审核</el-link>
          </template>
        </el-table-column>

        <el-table-column width="50px">
          <template slot-scope="scope">
            <el-link
              :class="['fs-12']"
              :type="'充值' | rolesButtonColor"
              :disabled="'充值' | rolesButton"
              @click="openDrawer('payment',scope.row)"
            >充值</el-link>
          </template>
        </el-table-column>

        <el-table-column width="70px">
          <template slot-scope="scope">
            <el-link
              :class="['fs-12']"
              type="primary"
              @click="openDrawer('reconciliation',scope.row)"
            >对账管理</el-link>
          </template>
        </el-table-column>

        <el-table-column width="80px">
          <template slot-scope="scope">
            <el-link
              :class="['fs-12']"
              :type="'子账户管理' | rolesButtonColor"
              :disabled="'子账户管理' | rolesButton"
              @click="toGroupAccount(scope.row)"
            >子账户管理</el-link>
          </template>
        </el-table-column>

        <el-table-column width="60px">
          <template slot-scope="scope">
            <el-link
              :class="['fs-12']"
              :type="'删除' | rolesButtonColor"
              :disabled="'删除' | rolesButton"
              @click="deleteGroup(scope.$index, scope.row)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <Drawer /> -->
    <Pagination :total="total" :change-page="changePage" />
    <Drawer ref="drawer" />
  </div>
</template>
<script>
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/token'
import Pagination from '../../components/pagination/index'
import AddGroup from './components/addGroup'
import Drawer from './components/drawer/index'
import Bus from '../../utils/bus'
export default {
  components: {
    Pagination,
    AddGroup,
    Drawer
  },
  data() {
    return {
      page: 1,
      total: 0,
      groupList: [],
      loading: true
    }
  },
  created() {
    var that = this
    Bus.$on('on-paymentSuccess', function (b) {
      if (b === 'success') {
        that.getGroupList(that.page)
      }
    })
  },
  mounted() {
    this.getGroupList()
  },
  methods: {
    //拉取机构列表
    getGroupList(page = 1) {
      this.$api.post('/institution/findInstitionList', { pageNum: page, pageSize: 10 }, res => {
        if (res.data) {
          let data = res.data
          this.groupList = data.list
          this.total = data.total
        }
        this.loading = false
      })
    },

    //点击分页
    changePage(page) {
      this.page = page
      this.getGroupList(page)
    },

    //审核
    shenhe(index, row) {
      this.$confirm('是否审核通过?', row.name, {
        cancelButtonText: '拒绝',
        confirmButtonText: '确定',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'cancelButtonClass',
        distinguishCancelAndClose: true,
        center: true
      }).then(() => {
        this.$api.post('/institution/reviewInstition', { insId: row.id, status: 1 }, res => {
          this.$message({
            type: 'success',
            message: '审核通过!'
          })
          this.getGroupList(this.page)
        })

      }).catch((action) => {
        if (action === 'cancel') {
          this.$api.post('/institution/reviewInstition', { insId: row.id, status: 2 }, res => {
            this.$message({
              message: '已拒绝!'
            });
            this.getGroupList(this.page)
          })
        }
      })
    },

    //删除机构
    deleteGroup(index, row) {
      this.$confirm('删除将不可恢复', '删除“' + row.name + '”', {
        cancelButtonText: '取消',
        confirmButtonText: '删除',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'cancelButtonClass',
        center: true
      }).then(() => {
        this.$api.post('/institution/delInstition', { insId: row.id }, res => {
          this.$message({
            type: 'success',
            message: '机构删除操作成功!'
          })
          this.getGroupList(this.page)
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },

    //成功新增机构的回调函数
    addSuccess() {
      this.getGroupList(this.page)
    },

    //打开充值弹窗
    openDrawer(name, row) {
      if(row.status !== '1'){
        this.$message({
          message: '机构未审核',
          type: 'warning'
        });
        return
      }
      this.$refs.drawer.open(name, row)
    },

    //前往子账户列表页面
    toGroupAccount(row) {
      this.$router.push({
        path: '/groupManage/groupAccount',
        query: {
          id: row.id
        }
      })
    },
    //下载
    downLoad(row) {
      this.$store.dispatch('user/resetToken').then((res) => {
        if (res.code === 200) {
          setToken('ht-token', res.data.access_token)
          setToken('ht-refreshtoken', res.data.refresh_token)
          window.location.href = '/asadms/downLoad/downloadFile?downloadPath=' + row.imgUrl + '&insName=' + row.name
        }
      })
    }

  }
}
</script>
<style scoped>
.ipt {
  width: 200px;
}
.wt-15 {
  display: inline-block;
  width: 15px;
}
.wt-24 {
  display: inline-block;
  width: 24px;
}
.mr {
  margin-right: 24px;
}
.name {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  line-height: 18px;
}
.dl,
.search {
  display: inline-block;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.dl {
  background: url("../../assets/img/Download.png") no-repeat center;
}
.search {
  background: url("../../assets/img/Search.png") no-repeat center;
}

/* .el-divider__text, .el-link {
    font-size: 12px !important;
} */
.badge {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: relative;
  top: -2px;
  margin-right: 8px;
}
.badge-success {
  background: #87d068;
}
.badge-wait {
  background: #ffaa00;
}
.badge-refuse {
  background: #f35600;
}
</style>
<style >
.fs-12 {
  font-size: 12px !important;
}
.group-list-table .el-button {
}
</style>