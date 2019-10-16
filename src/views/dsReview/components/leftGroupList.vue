<template>
  <div class="dsReview-leftlist">
    <div class="left-top">
      <el-button class="add-group" type="primary" @click="goTo">查看全部机构订单</el-button>
      <span class="r"></span>
    </div>
    <div class="infinite-list-wrapper">
      <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
        <li
          v-for="(item,index) in groupList"
          :key="index"
          class="list-item"
          @click="getOrderList(item.id,item.name)"
        >
          <div class="name">{{item.name}}</div>
        </li>
      </ul>
      <p v-if="loading" v-loading="loading"></p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'leftGroupList',
  data() {
    return {
      count: 10,
      loading: false,
      groupList: [],
      page: 1,
      resLength: 0,
      firstOrder:true
    }
  },
  props: {
    getList: {
      type: Function
    }
  },
  computed: {
    noMore() {
      return this.resLength > 0 ? true : false
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {
    // this.getInstList()
  },
  methods: {
    load() {
      this.loading = true
      this.page + 1
      this.getInstList(this.page)
    },

    getInstList(page = 1) {
      this.$api.post('/dataSource/findAllInsWithApply', { pageNum: page, pageSize: 10 }, res => {
        let data = res.data
        this.resLength = data.length
        this.groupList = this.groupList.concat(data)
         if(this.resLength > 0){
           if(this.firstOrder){
          this.getOrderList(this.groupList[0].id,this.groupList[0].name)
          this.firstOrder = false
        }
        }
        this.loading = false
      })
    },
    //获取机构下的订单
    getOrderList(id,name) {
      this.getList(id,name)
    },
    goTo() {
      this.$router.push({ path: "/dsReview/allDsOrder" });
    },

  }
}
</script>
<style scoped>
.dsReview-leftlist .left-top {
  padding: 20px 0 14px 7px;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  position: relative;
  text-align: center;
}
.dsReview-leftlist .left-top .r {
  position: absolute;
  width: 8px;
  height: 847px;
  background: #ecf0f1;
  top: 0;
  right: 0px;
  z-index: 2001;
}
.dsReview-leftlist li {
  padding: 15px 8px 15px 19px;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  cursor: pointer;
}

.dsReview-leftlist .name {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 20px;
  font-weight: 600;
}
.dsReview-leftlist .add-group {
  height: 28px;
  width: 120px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
  position: relative;
  left: -8px;
}
.dsReview-leftlist .infinite-list-wrapper {
  height: calc(100vh - 196px);
  overflow-y: auto;
  overflow-x: hidden;
}
.dsReview-leftlist .infinite-list-wrapper p {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>