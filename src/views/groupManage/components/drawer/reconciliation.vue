<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%"
      :header-cell-style="{'font-weight':'600','background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
      cell-class-name="fs-12"
    >
      <el-table-column width="30px"></el-table-column>
      <el-table-column label="用户名" prop="origin_account"></el-table-column>
      <el-table-column label="决策名称" prop="prodcut"></el-table-column>
      <el-table-column label="支付费用">
        <template slot-scope="scope">
          <span class="zhifufeiyong">{{scope.row.net_receipts}}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="table2">
            <el-table
              ref="singleTable"
              :data="props.row.prodcut_detail"
              style="width: 100%"
              size="mini"
              :border="false"
              header-cell-style="{'border':'none','font-family': 'PingFangSC-Regular','font-size': '12px','color': '#919191','line-height': '18px'}"
            >
              <el-table-column prop="sourceName" label="数据源名称"></el-table-column>
              <el-table-column prop="name" label="进件状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === '1'">
                    <span class="badge badge-wait"></span>进件成功
                  </span>
                  <span v-if="scope.row.status === '2'">
                    <span class="badge badge-success"></span>进件失败
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="operationTime" label="操作时间"></el-table-column>
              <el-table-column prop="category" label="支付费用">
                <template slot-scope="scope">
                  <span class="zhifufeiyong">{{scope.row.price}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'reconciliation',
  data() {
    return {
      list: []
    }
  },
  methods: {
    getList(id) {
      this.$api.post('/offline/getSummary', {paymentUniqueCode: id, pageNum: 1, pageSize: 9999 }, res => {
        this.list = res.data.data.dataList
      })
    }
  }
}
</script>
<style scoped>
.zhifufeiyong {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #47c26f;
  line-height: 18px;
}
.demo-table-expand {
  font-size: 0;
  float: right;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
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
<style>
.el-table__expanded-cell .el-table .cell {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 18px;
}

.el-table__expanded-cell .el-table th > .cell {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #919191;
  line-height: 18px;
}
.el-table__expanded-cell .el-table td,
.el-table__expanded-cell .el-table th.is-leaf {
  border: none;
}

.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
</style>