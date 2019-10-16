<template>
  <div class="recharg-record">
    <el-table
      ref="filterTable"
      :data="data"
      style="width: 100%"
      :default-sort = "{prop: 'order_time', order: 'descending'}"
      :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
      cell-class-name="cell-class"
    >
      <el-table-column width="30px"></el-table-column>

      <el-table-column label="账号">
        <template slot-scope="scope">
          <div class="name">{{scope.row.recharge_account}}</div>
        </template>
      </el-table-column>

      <el-table-column label="充值金额">
        <template slot-scope="scope">
          <div class="add">+{{scope.row.recharge_Amount}}元</div>
        </template>
      </el-table-column>

      <el-table-column label="充值后余额">
        <template slot-scope="scope">
          <div class="balance">{{scope.row.balance_after_trade}} 元</div>
        </template>
      </el-table-column>

      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <div class="time">{{scope.row.order_time}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'rechargRecord',

  data() {
    return {
      data: []
    }
  },

  watch: {

  },
  mounted() {

  },
  methods: {
    getList(id){
      this.$api.post('/offline/getRechargeRecord', { paymentUniqueCode:id,pageNo: 1, pageSize: 99 }, res => {
        this.data = res.data.data.dataList
      })
    }
  }
}
</script>
<style scoped>
.add {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffaa00;
  line-height: 18px;
}
</style>