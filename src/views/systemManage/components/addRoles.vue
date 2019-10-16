<template>
  <div class="add-roles-box">
    <el-button class="add-roles" type="primary" icon="el-icon-plus" @click="add">新增角色</el-button>
    <el-dialog
      class="dialog"
      :title="title"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-divider></el-divider>
      <div v-if="title==='修改角色'">
        <el-form ref="form" :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">{{form.name}}</el-form-item>

          <el-form-item label="角色功能">{{form.description}}</el-form-item>
        </el-form>
      </div>

      <div v-if="title==='新增角色'">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="角色功能" class="ipt2">
            <el-input type="textarea" resize="none" v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="select-box">
        <span class="select-label">角色权限</span>
        <div class="pd">
          <el-checkbox v-model="checked" @change="allCheck" class="all-roles">所有权限</el-checkbox>
          <el-tree
            ref="tree"
            :data="data"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
            @check-change="handleCheckChange"
          ></el-tree>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'addRoles',
  props: {
    rowData: {
      type: Object,
      required: {}
    },
    getList: {
      type: Function
    }
  },
  watch: {
    rowData: {
      handler(newData, oldData) {
        if (newData && JSON.stringify(newData) !== '{}') {
          this.dialogFormVisible = true
          this.title = '修改角色'
          this.form = {
            name: '',
            funcIdStr: '',
            description: ''
          }
          this.id = newData.id
          this.defaultCheckedKeys = newData.rolesInfo
          this.rolesParmas = newData.rolesInfo
          this.form.name = newData.name
          this.form.funcIdStr = newData.rolesInfo.join(',')
          this.form.description = newData.description
          this.modifyAllCheckFlag(this.defaultCheckedKeys)

          // this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
        }
        return
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      id: null,
      form: {

      },
      formLabelWidth: '110px',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
      },
      dataStr: [],
      data: [{
        id: 'manage-10',
        label: '机构管理',
        children: [{
          id: 'manage-1010',
          label: '审批',
        }, {
          id: 'manage-1020',
          label: '充值',
        }, {
          id: 'manage-1030',
          label: '删除',
        }, {
          id: 'manage-1040',
          label: '子账户管理',
        }]
      }, {
        id: 'manage-20',
        label: '数据源审批',
        children: [{
          id: 'manage-2010',
          label: '一级审批'
        }, {
          id: 'manage-2020',
          label: '二级审批'
        }, {
          id: 'manage-2030',
          label: '改价'
        }]
      }, {
        id: 'manage-30',
        label: '系统管理',
        children: [{
          id: 'manage-3010',
          label: '角色管理'
        }, {
          id: 'manage-3020',
          label: '用户管理'
        }]
      }],
      rolesObj: {
        'manage-1010': '5',
        'manage-1020': '6',
        'manage-1030': '7',
        'manage-1040': '8',
        'manage-2010': '9',
        'manage-2020': '10',
        'manage-2030': '11',
        'manage-3010': '12',
        'manage-3020': '13'
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '新增角色',
      checked: true,
      defaultCheckedKeys: ['manage-20'],
      partentNode: ['manage-10', 'manage-20', 'manage-30'],
      rolesParmas: []
    }

  },

  mounted() {

  },
  methods: {
    //重置
    add() {
      this.dialogFormVisible = true
      this.title = '新增角色'
      this.checked = false
      this.defaultCheckedKeys = []
      this.rolesParmas = []
      this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
      this.form.description = ''
      this.form.name = ''
      this.form.funcIdStr = ''
      if (this.form.id) {
        delete this.form.id
      }
      this.id = null
    },
    allCheck() {
      this.checked ? this.$refs.tree.setCheckedKeys(this.partentNode) : this.$refs.tree.setCheckedKeys([])
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        if (!this.partentNode.includes(data.id)) this.rolesParmas.push(data.id)
      } else {
        if (!this.partentNode.includes(data.id)) {
          this.rolesParmas = this.rolesParmas.filter(item => {
            return item != data.id
          });
        }
      }
    },
    modifyAllCheckFlag(rowStr) {
      for (let item of this.data) {
        this.dataStr.push(item.myselfId)
      }
      for (let item in this.dataStr) {
        if (!rowStr.includes(this.dataStr[item])) {
          this.checked = false
        }
      }
      this.checked = true
    },
    //提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (this.id) {
          this.form.id = this.id
        }
        let array = []
        for (let i in this.rolesParmas) {
          array.push(this.rolesObj[this.rolesParmas[i]])
        }
        this.form.funcIdStr = array.join(',')
        this.$api.post('/role/addOrEdit', this.form, res => {
          this.$message({
            message: '角色修改成功',
            type: 'success'
          });
          this.dialogFormVisible = false
          this.getList(this.id, this.form)
        })
      })
    }
  }
}
</script>
<style scoped>
.add-roles {
  height: 28px;
  width: 88px;
  line-height: 28px;
  padding: 0;
  font-size: 12px;
}
</style>
<style >
.add-roles-box .el-input {
  width: 336px;
}
.add-roles-box .el-input .el-input__inner {
  width: 100%;
  height: 28px !important;
  line-height: 28px !important;
  background: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  font-size: 12px;
}
.add-roles-box .el-form-item {
  margin-bottom: 16px;
}
.add-roles-box .el-form-item__error {
  padding-top: 0px;
  font-size: 10px;
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

.add-roles-box .el-form-item__label,
.add-roles-box .el-form-item__content {
  height: 28px;
  line-height: 28px;
}
.add-roles-box .el-form-item__label {
  width: 110px;
  text-align: right;
}
.add-roles-box .el-textarea {
  width: 336px;
}
.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog__body {
  padding: 0 20px;
}
.add-roles-box .el-dialog {
  width: 494px !important;
}
.add-roles-box .el-divider--horizontal {
  margin-bottom: 10px;
}
.add-roles-box .el-dialog__footer {
  padding: 1px 20px 10px;
  text-align: right;
}
.add-roles-box .dialog-footer .el-button {
  width: 65px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
}

.add-roles-box .el-input__icon {
  line-height: 28px !important;
}

.add-roles-box .select-box {
  /* margin-top: 45px; */
}
.add-roles-box .pd {
  display: inline-block;

  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  width: 335px;
}
.add-roles-box .pd .all-roles {
  display: inline-block;
  padding: 20px;
  background: #f7f7f7;
  width: 335px;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
}
.add-roles-box .select-label {
  display: inline-block;
  width: 110px;
  text-align: right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 17px;
  vertical-align: top;
  padding-right: 10px;
  box-sizing: border-box;
}
.add-roles-box .select-label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.add-roles-box .el-tree {
  /* display: inline-block; */
  /* padding-left: 86px; */
  /* padding-top: 10px; */
  padding: 20px;
}
.add-roles-box .el-tree .el-tree-node__content {
  height: 35px;
}
.add-roles-box .el-form {
  padding-top: 20px;
}
.ipt2 {
  height: 55px;
}
</style>
