<template>
  <div class="box">
    <el-pagination
      background
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props:{
    total:{
      type:Number,
      required:0
    },
    changePage:{
      type:Function
    }
  },
  watch:{
    total(newData ,oldData){
      this.total = newData
    }
  },
  methods: {
    handleCurrentChange(val) {
      if(this.changePage){
        this.changePage(val)
      }
      
    }
  }
}
</script>
<style scoped>
.box {
  padding-top: 32px;
  text-align: right;
}
.el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px !important;
}
.el-pagination.is-background .el-pager li,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 12px;
  line-height: 27px;
}
</style>