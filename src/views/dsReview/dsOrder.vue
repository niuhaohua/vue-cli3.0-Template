<template>
  <div class="dsReview-main">
    <div class="left">
      <left-list :get-list="getOrderList" />
    </div>

    <div class="right">
      <div class="title">{{title}}</div>
      <order-list
        v-loading="loading"
        :group-id="groupId"
        :title="title"
        :data="orderList"
        :label-flag="false"
        :get-list="getOrderList"
      />
    </div>
  </div>
</template>
<script>
import OrderList from './components/orderList'
import LeftList from './components/leftGroupList'
export default {
  name: 'dsOrder',
  components: {
    OrderList,
    LeftList
  },
  data() {
    return {
      groupId: null,
      modifyData: {},
      orderList: [],
      title: '',
      loading: true
    }
  },
  methods: {
    //获取机构下订单列表
    getOrderList(id, name) {
      this.loading = true
      this.title = name
      this.groupId = id
      this.$api.post('/dataSource/findAllDataSourceApply', { institutionId: id }, res => {
        let data = res.data
        this.orderList = data.list
        this.loading = false
      })
    },
  }
}
</script>
<style scoped>
.dsReview-main .mr {
  margin-right: 24px;
}
.dsReview-main {
  padding: 0;
  min-height: calc(100vh - 129px);
  box-sizing: border-box;
}
.dsReview-main .left {
  width: 240px;
  background: #fff;
  position: absolute;
}

.dsReview-main .right {
  padding-left: 240px;
  height: calc(100vh - 133px);
  overflow-y: auto;
  background: #fff;
}
.dsReview-main .right .title {
  padding: 24px 0 24px 16px;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 18px;
  background: #fff;
  font-weight: 600;
}
</style>
<style>
/*滚动条样式*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 18px;
}

::-webkit-scrollbar-track {
  border-radius: 0;
  background: #ecf0f1;
}
</style>