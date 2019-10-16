<template>
  <div class="page-main">
    <add-roles :row-data="row" :get-list="restList" />
    <el-divider></el-divider>
    <div class="tableList">
      <el-table
      v-loading="loading"
        ref="filterTable"
        :data="rolesList"
        style="width: 100%"
        :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
        cell-class-name="cell-class"
      >
        <el-table-column width="30px"></el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>

        <el-table-column label="角色">
          <template slot-scope="scope">
            <div class="name">{{scope.row.name}}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色描述 ">
          <template slot-scope="scope">
            <div class="name">{{scope.row.description}}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-link
              :class="['mr', 'fs-12']"
              type="primary"
              @click="modify(scope.$index,scope.row)"
            >修改</el-link>
            <!-- <el-link :class="['mr', 'fs-12']" type="primary">对账管理</el-link> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :total="total" :change-page="changePage" />
  </div>
</template>
<script>
import AddRoles from './components/addRoles'
import Pagination from '../../components/pagination'
export default {
  name: 'roles',
  components: {
    AddRoles,
    Pagination
  },
  data() {
    return {
      loading:true,
      total: 100,
      row: {},
      rowIndex: null,
      page: '',
      rolesList: []
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    goTo() {
      this.$router.go(-1)
    },
    getRolesList(page = 0) {
      this.loading = true
      this.$api.post('/role/list', { currentPage: page }, res => {
        let data = res.data
        this.rolesList = data.list
        this.total = data.list.length
        this.loading = false
      })
    },
    //
    changePage(page) {
      this.page = page
      this.getRolesList(page)
    },
    //修改
    modify(index, row) {
      this.row = {}
      this.index = index
      this.getRolesInfo(row.id).then(res => {
        this.row = row
        this.row.rolesInfo = res
      })
    },
    //修改或者添加之后的回调方法
    restList(id) {
      if (id) {
        this.getRolesList(this.index)
      } else {
        this.getRolesList()
      }
    },
    getRolesInfo(id) {
      return new Promise(resolve => {
        this.$api.post('/role/getRoleById', { roldId: id }, res => {
          let list = []
          let noArray = ['manage-0','manage-10','manage-20','manage-30']
          for (let item of res.data.func) {
            if (!noArray.includes(item.myselfId)) {
              list.push(item.myselfId)
            }
          }
          resolve(list)
        })
      })
    }
  }
}
</script>
<style scoped>
.mr {
  margin-right: 24px;
}
.add-group {
  height: 28px;
  width: 88px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
}
</style>
<style >
.fs-12 {
  font-size: 12px !important;
}
.group-list-table .el-button {
}
</style>