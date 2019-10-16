<template>
  <div class="page-main">
    <el-button class="allDsOrder" type="primary" icon="el-icon-arrow-left" @click="goBack()">返回上一步</el-button>
    <el-divider></el-divider>
    <order-list v-loading="loading" :data="allOrderList" :group-id="null" :label-flag="true" :get-list="getList" />
    <Pagination :total="total" :change-page="changePage" />
  </div>
</template>
<script>
import OrderList from './components/orderList'
import Pagination from '../../components/pagination/index'
export default {
  name: 'allDsOrder',
  components: {
    OrderList,
    Pagination
  },
  data() {
    return {
      page: 0,
      total: 0,
      allOrderList: [],
      loading:true
    }
  },
  mounted() {
    this.getAllOrderList()
  },
  methods: {
    //获取全部订单列表
    getAllOrderList(page = 0) {
      this.loading = true
      this.$api.post('/dataSource/findAllDataSourceApply', { pageNum: page, pageSize: 10 }, res => {
        let data = res.data
        this.allOrderList = data.list
        this.total = data.total
        this.loading = false
      })
    },

    //点击分页
    changePage(page) {
      this.page = page
      this.getAllOrderList(page)
    },

    //操作后的回调方法
    getList() {
      this.getAllOrderList(this.page)
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.allDsOrder {
  height: 28px;
  width: 90px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
  position: relative;
  left: -8px;
}
</style>