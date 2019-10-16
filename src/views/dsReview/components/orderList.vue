<template>
  <div class="orderList">
    <el-table
      ref="filterTable"
      :data="orderList"
      style="width: 100%"
      :header-cell-style="{'background':'#F8F7F6','font-size': '12px','font-family': 'PingFangSC-Semibold','font-weight':'600'}"
      cell-class-name="cell-class"
    >
      <el-table-column width="30px"></el-table-column>

      <el-table-column label="订单号">
        <template slot-scope="scope">
          <div class="name">{{scope.row.orderNo}}</div>
        </template>
      </el-table-column>

      <el-table-column label="用户名">
        <template slot-scope="scope">
          <div>{{scope.row.creator}}</div>
        </template>
      </el-table-column>

      <el-table-column v-if="labelFlag" label="所属机构">
        <template slot-scope="scope">
          <div>{{scope.row.insName}}</div>
        </template>
      </el-table-column>

      <el-table-column label="使用协议" width="100px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
            <div class="dl" @click="downLoad(scope.row.orderNo)"></div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="数据源名称" width="200px">
        <template slot-scope="scope">
          <div class="ds-name">{{scope.row.priceChangeList[0].dsName}}</div>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="170px">
        <template slot-scope="scope">
          <span
            :class="showNewPrice(scope.row)?'oldPrice':'oldPrice1'"
          >{{scope.row.priceChangeList[0].originalPrice}}元/次</span>
          <span
            class="newPrice"
            v-if="showNewPrice(scope.row)"
          >{{scope.row.priceChangeList[0].changePrice}}元/次</span>
        </template>
      </el-table-column>

      <el-table-column width="70px">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left" title="查看">
            <el-card class="box-card">
              <div v-for="(item,index) in scope.row.priceChangeList" :key="index" class="text item">
                <span class="box-card-dsname">
                  <span class="badge badge-primary"></span>
                  {{item.dsName}}
                </span>
                <span class="price">
                  <span :class="item.changePrice?'oldPrice':'oldPrice1'">{{item.originalPrice}}元/次</span>
                  <span class="newPrice" v-if="item.changePrice">{{item.changePrice}}元/次</span>
                </span>
              </div>
            </el-card>
            <div slot="reference" class="name-wrapper">查看更多</div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="申请时间">
        <template slot-scope="scope">
          <div>{{scope.row.creatTime | renderTime}}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="70px">
        <template slot-scope="scope">
          <div v-if="scope.row.dataSourceApprovalList[0].approvalResult != 1">
            <el-popover trigger="hover" placement="top">
              {{scope.row.dataSourceApprovalList[0].description}}
              <div slot="reference" class="name-wrapper">
                <span :class="['fs-12','level1']">
                  <el-tag
                    v-if="scope.row.dataSourceApprovalList[0].approvalResult == 2"
                    size="mini"
                    type="success"
                  >已通过</el-tag>
                  <el-tag
                    v-if="scope.row.dataSourceApprovalList[0].approvalResult == 3"
                    size="mini"
                    type="danger"
                  >已拒绝</el-tag>
                </span>
              </div>
            </el-popover>
          </div>
          <div v-if="scope.row.dataSourceApprovalList[0].approvalResult == 1">
            <span :class="['fs-12','level1']">
              <el-link
                :class="['fs-12']"
                :type="'一级审批' | rolesButtonColor"
                :disabled="'一级审批' | rolesButton"
                @click="modify(scope.row,0)"
              >一级审批</el-link>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="70px">
        <template slot-scope="scope">
          <div v-if="scope.row.dataSourceApprovalList[1].approvalResult != 1">
            <el-popover trigger="hover" placement="top">
              {{scope.row.dataSourceApprovalList[1].description}}
              <div slot="reference" class="name-wrapper">
                <span :class="['fs-12','level1']">
                  <el-tag
                    v-if="scope.row.dataSourceApprovalList[1].approvalResult == 2"
                    size="mini"
                    type="success"
                  >已通过</el-tag>
                  <el-tag
                    v-if="scope.row.dataSourceApprovalList[1].approvalResult == 3"
                    size="mini"
                    type="danger"
                  >已拒绝</el-tag>
                </span>
              </div>
            </el-popover>
          </div>
          <div v-if="scope.row.dataSourceApprovalList[1].approvalResult == 1">
            <span :class="['fs-12','level1']">
              <el-link
                :class="['fs-12']"
                :type="'二级审批' | rolesButtonColor"
                :disabled="'二级审批' | rolesButton"
                @click="modify(scope.row,1)"
              >二级审批</el-link>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="60px">
        <template slot-scope="scope">
          <el-link
            :class="['fs-12']"
            :type="'改价' | rolesButtonColor"
            :disabled="'改价' | rolesButton"
            @click="modifyPrice(scope.row)"
          >改价</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      class="modify-price-dialog"
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <el-table :data="priceChangeList" size="mini">
        <el-table-column property="dsName" label="数据源名称"></el-table-column>
        <el-table-column property="originalPrice" label="价格">
          <template slot-scope="scope" class="text">
            <span class="price">
              <span
                :class="scope.row.changePrice?'oldPrice':'oldPrice1'"
              >{{scope.row.originalPrice}}元/次</span>
              <span class="newPrice" v-if="scope.row.changePrice">{{scope.row.changePrice}}元/次</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="修改后价格">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="modifyPriceParmas[scope.$index].changePrice"
              placeholder="请输入新价格"
              @change="changePrice(scope.row,modifyPriceParmas[scope.$index].changePrice) "
            >
              <i class="suffix" slot="suffix">元/次</i>
            </el-input>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <!-- <el-divider></el-divider> -->
        <el-button type="primary" @click="submitNewPrice">确 定</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/token'
export default {
  name: 'orderList',

  data() {
    return {
      dialogTableVisible: false,
      dialogTitle: '',
      listData: this.data,
      visible: false,
      newPrice: '',
      priceChangeList: [],
      modifyPriceParmas: [],
      orderList: [],
      gridData: [],
      institutionId: null
    }
  },
  props: {
    data: {
      type: Array,
      required: []
    },
    labelFlag: {
      type: Boolean,
      required: false,
    },
    getList: {
      type: Function
    },
    groupId: {
      type: Number,
    },
    title: {
      type: String,
      required: '',
    }
  },
  watch: {
    data: {
      handler(newData, oldData) {
        if (newData.length > 0) {
          this.orderList = newData
        }
      },
      immediate: true,
      deep: true
    },
    labelFlag(newData, oldData) {
      this.labelFlag = newData
    },
    groupId(newData, oldData) {
      this.groupId = newData
    },
    title(newData, oldData) {
      this.title = newData
    }
  },
  computed: {

  },
  methods: {
    showNewPrice(row) {
      return row.priceChangeList[0].changePrice
    },
    //审批
    modify(row, index) {
      let item = row.dataSourceApprovalList[index]
      if (index === 1) {
        this.$api.post('/dataSource/validApprovalOfSecond', { orderNo: item.orderNo }, res => {
          if (res.data) {
            this.confirm(row, item)
          } else {
            this.$alert('请先做一级审批处理', '', {
              confirmButtonText: '确定',
            })
          }
        })
      } else {
        this.confirm(row, item)
      }
    },
    confirm(row, item) {
      this.$confirm('是否确认通过?', '数据源审批', {
        cancelButtonText: '拒绝',
        confirmButtonText: '通过',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'cancelButtonClass',
        showInput: true,
        distinguishCancelAndClose: true,
        inputPlaceholder: "请输入理由（必填）",
        center: true,
        inputValidator: (value) => {
          if (value.trim().length > 50) {
            return '理由必填，请控制在50字符以内'
          }
        },
        beforeClose: (action, instance, done) => {
          if (action === 'close') {
            done()
          }
          let value = instance.inputValue.trim()
          if (value === null || value === 'null' || value.length <= 0) {
            this.$message({
              message: '请输入理由',
              type: 'warning'
            });
            return
          }
          if (value.length > 50) {
            this.$message({
              message: '理由必填，请控制在50字符以内',
              type: 'warning'
            });
            return
          }
          if (action === 'confirm') {
            this.$api.post('/dataSource/approvalOperate', { institutionId: row.institutionId, approvalType: item.approvalType, approvalResult: 2, orderNo: item.orderNo, description: value }, res => {
              this.$message({
                message: '已经通过',
                type: 'success'
              });
              done()
              this.getList(this.groupId ? this.groupId : row.institutionId, this.title)
            })
          } else if (action === 'cancel') {
            this.$api.post('/dataSource/approvalOperate', { institutionId: row.institutionId, approvalType: item.approvalType, approvalResult: 3, orderNo: item.orderNo, description: value }, res => {
              this.$message({
                message: '已经拒绝',
                type: 'success'
              });
              done()
              this.getList(row.institutionId, this.title)
            })
          }
        },
      })
    },
    //改价
    modifyPrice(row) {
      let priceChangeList = row.priceChangeList
      this.modifyPriceParmas = []
      for (let item of priceChangeList) {
        console.log(item)
        this.modifyPriceParmas.push({
          orderNo: item.orderNo,
          dsId: item.dsId,
          changePrice: ''
        })
      }
      this.institutionId = row.institutionId
      this.dialogTableVisible = true
      this.priceChangeList = priceChangeList
    },
    changePrice(row, newPrice) {
        for (let item of this.modifyPriceParmas) {
          if (item.dsId === row.dsId) {
            item.changePrice = newPrice
          }
      }
    },
    //提交改价
    submitNewPrice() {
      let flag = true
      let list = this.modifyPriceParmas.filter((item) => {
        let reg = /^\d+(\.\d{1,2})?$/
        if (!reg.test(Number(item.changePrice))) {
          flag = false
        }
        return item.changePrice.length > 0;
      })
      if (!flag) {
        this.$message({
          message: '请输入勿超过两位小数的改动价格',
          type: 'warning'
        });
        return
      }
      this.$api.post('/dataSource/addPriceChange', { institutionId: this.institutionId, priceChangeList: JSON.stringify(list) }, res => {
        this.$message({
          message: '价格修改成功',
          type: 'success'
        })
        if (this.groupId) {
          this.getList(this.groupId, this.title)
        } else {
          this.getList()
        }
        this.dialogTableVisible = false
      })
    },
    //下载
    downLoad(orderNo) {
      this.$store.dispatch('user/resetToken').then((res) => {
        if (res.code === 200) {
          setToken('ht-token', res.data.access_token)
          setToken('ht-refreshtoken', res.data.refresh_token)
          window.location.href = '/asadms/dataSource/download?orderNo=' + orderNo
        }
      })
    }
  }
}
</script>
<style scoped>
.dl {
  display: inline-block;
  width: 15px;
  height: 15px;
  cursor: pointer;
  margin-left: 16px;
}
.dl {
  background: url("../../../assets/img/Download.png") no-repeat center;
}
.mr {
  margin-right: 24px;
}
.oldPrice {
  text-decoration: line-through;
  margin-right: 8px;
}
.oldPrice {
  margin-right: 8px;
}
.newPrice {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #f35600;
  line-height: 18px;
}
.name-wrapper {
  display: inline-block;
  cursor: pointer;
}
.ds-name {
  /* width: 200px; */
  /* overflow: auto; */
  /* white-space: nowrap; */
  /* text-overflow: ellipsis; */
}
.popover-button {
  border: 0;
  padding: 0;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #5e97f0;
  line-height: 18px;
  background: none;
}
.popover-button:hover {
  border: 0;
  padding: 0;
  background: none;
  text-decoration: underline;
}

.text,
.text .oldPrice,
.text .newPrice {
  font-size: 14px;
  padding: 5px 0;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #565656;
}
.text .newPrice {
  color: #f35600;
}
.text .price {
  float: right;
}
.newPrice {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #f35600;
  line-height: 18px;
}
.box-card {
  width: auto;
  box-shadow: none;
  border: none;
}
.box-card-dsname {
  margin-right: 25px;
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
.badge-primary {
  background: #498eff;
}
.suffix {
  position: relative;
  top: 3px;
}
</style>
<style >
.orderList .box-card .el-card__body {
  padding: 0px;
}
.orderList .modify-price-dialog .el-dialog__body {
  padding: 20px 10px 0px 10px;
}
.orderList .fs-12 {
  font-size: 12px !important;
}
/* .orderList .el-dialog__footer .el-divider--horizontal {
  margin-bottom: 10px;
} */
.orderList .el-table--mini td {
  padding: 10px 0;
}
.orderList .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}
</style>