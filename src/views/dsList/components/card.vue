<template>
  <div>
    <el-row :gutter="10">
      <el-col v-for="(item, index) in dsList" :key="index" :md="12" :lg="8" :xl="6">
        <div class="whiteCollar-setMeal">
          <div class="top">
            <span class="icon">
              <img :src="item.dname| dsListIcon" alt />
            </span>
            <div class="dsname">{{item.dname}}<span v-if="item.remarks" class="remarks">({{item.remarks}})</span></div>
            <div class="price">
              {{item.dtotalPrice}}元/
              <span class="danwei">次</span>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <div class="title">输入项</div>
              <div class="content">
                <div class="content-box">
                  <div class="item" v-for="(iptItem,iptIndex) in iptArray(item)" :key="iptIndex">
                    <span v-if="iptItem.length>0">
                      <span class="itemcir"></span>
                      <span class="itemtext">{{iptItem}}</span>
                    </span>
                    
                  </div>
                </div>
                <!-- <div class="zhankai" v-if="iptArray(item).length>4">
                  <span class="ddd">......</span>
                  <span class="zhankaitext">
                    展开
                    <i class="el-icon-arrow-down"></i>
                  </span>
                </div>-->
              </div>
            </div>
            <div class="right">
              <div class="title">输出项</div>
              <div class="content">
                <div class="content-box">
                  <div class="item" v-for="(outItem,outIndex) in outArray(item)" :key="outIndex">
                    <span v-if="outItem.length>0">
                      <span class="itemcir" v-if="showItemcir(outIndex,item)"></span>
                    <span class="itemtext">{{outItem}}</span>
                    </span>
                    
                  </div>
                </div>
                <!-- <div class="zhankai" v-if="outArray(item).length>4">
                  <span class="ddd">......</span>
                  <span class="zhankaitext">
                    展开
                    <i class="el-icon-arrow-down"></i>
                  </span>
                </div>-->
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'card',
  props: {
    dataList: {
      type: Array,
      required: []
    }
  },
  data() {
    return {
      dsList: []
    }
  },
  computed: {

  },
  watch: {
    dataList: {
      handler(newData, oldData) {
        this.dsList = newData
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    iptArray(item) {
      return item.dinput.split(";")
    },
    outArray(item) {
      return item.doutput.split(";")
    },
    showItemcir(index, item) {
      if (index !== 0) {
        return true
      } else {
        return item.dname === '司法风险画像' ? true : false
      }
    },
    enter() {
      let mo = function (e) { e.preventDefault() }
      document.addEventListener("touchmove", mo, false);//禁止页面滑动
    },
    leave() {
      let mo = function (e) { e.preventDefault() }
      document.removeEventListener("touchmove", mo, false)
    }
  }
}
</script>
<style>
.whiteCollar-setMeal {
  margin: 0 15px;
  margin-bottom: 40px;
  background: #ffffff;
  box-shadow: 0 0 8px 0 #d9d9d9;
  border-radius: 8px;
  padding-bottom: 16px;
}
.whiteCollar-setMeal .top {
  padding-top: 24px;
  padding-bottom: 24px;
  text-align: center;
  box-sizing: border-box;
}
.top .icon {
  display: inline-block;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  text-align: center;
}
.top .icon img {
  display: inline-block;
  width: 100%;
}
.top .dsname {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #262626;
  margin-bottom: 8px;
}
.top .price {
  font-family: HelveticaNeue;
  font-size: 18px;
  color: #f35600;
  line-height: 22px;
}
.top .dsname .remarks{
  font-size: 12px;
  color: #909399;
}
.top .price .danwei {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #f35600;
  line-height: 20px;
}

.bottom {
  display: flex;
}
.bottom .left {
  flex: 1;
}
.bottom .right {
  flex: 1;
}
.bottom .title {
  background: #f7f7f7;
  height: 40px;
  line-height: 40px;
  padding-left: 23px;
  box-sizing: border-box;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #666666;
}

.bottom .content {
  padding: 11px 0px 0px 9px;
  box-sizing: border-box;
}
.bottom .right .content {
  padding: 11px 15px 0px 9px;
}
.bottom .content-box {
  height: 160px;
  overflow: auto;
}

/*滚动条样式*/
.bottom .content-box::-webkit-scrollbar {
  width: 3px;
  height: 8px;
}

.bottom .content-box::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #bfbfbf;
}

.bottom .content-box::-webkit-scrollbar-track {
  border-radius: 0;
}

.bottom .left .content-box {
  border-right: 2px dotted #cccccc;
  min-height: 120px;
}
.bottom .item {
  padding-left: 15px;
  line-height: 18px;
  margin-bottom: 12px;
}
.bottom .itemcir {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #1890ff;
  margin-right: 4px;
  margin-bottom: 2px;
}
.bottom .itemtext {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #262626;
}
.bottom .zhankai {
  padding-left: 15px;
}
.bottom .ddd {
  position: relative;
  top: -4px;
}
.bottom .zhankaitext {
  cursor: pointer;
  text-align: left;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #498eff;
  margin-left: 20px;
}
</style>