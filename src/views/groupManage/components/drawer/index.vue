<template>
  <div>
    <el-drawer
      :title="this.switch ==='payment'?'充值':'对账管理'"
      :visible.sync="openFlag"
      direction="rtl"
      size="50%"
    >
      <div class="header">
        <p>{{title}}</p>
        <p>机构余额：{{amount}}元</p>
      </div>

      <template v-if="this.switch === 'payment'">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="充值" name="first">
            <Payment :id="instId" />
          </el-tab-pane>
          <el-tab-pane label="充值记录" name="second">
            <recharg-record ref="rechargRecord" />
          </el-tab-pane>
        </el-tabs>
      </template>

      <template v-if="this.switch === 'reconciliation'">
        <Reconciliation ref="reconciliation" />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import Reconciliation from './reconciliation'
import Payment from './payment'
import RechargRecord from './rechargRecord'
export default {
  name: 'drawer',
  components: {
    Reconciliation,
    Payment,
    RechargRecord
  },
  data() {
    return {
      activeName: 'first',
      openFlag: false,
      instId: null,
      title: '',
      amount: '',
      switch: '',
    }
  },
  methods: {
    open(name, row) {
      this.activeName = 'first'
      this.title = row.name
      this.amount = row.insAmount
      this.openFlag = true
      this.switch = name
      this.instId = row.balanceId

      this.$nextTick(() => {
        if (name === 'reconciliation') {
          this.$refs.reconciliation.getList(this.instId)
        }
      })


    },
    handleClick(tab, event) {
      if (tab.label === '充值记录') {
        this.$refs.rechargRecord.getList(this.instId)
      }
    }
  }
}
</script>
<style>
.el-drawer__header {
  font-weight: 600;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0px;
  padding: 9px 16px;
}
.header {
  height: 117px;
  background: #eaf1fd;
  padding: 16px;
  box-sizing: border-box;
}
.header p:nth-of-type(1) {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  font-weight: 600;
  margin-bottom: 16px;
}
.header p:nth-of-type(2) {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
}
.el-tabs__item {
  width: 128px;
  text-align: center;
  height: 46px;
  line-height: 46px;
}
.el-drawer.rtl {
  overflow: auto !important;
  min-width: 595px;
}
</style>