<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      action="/asadms/institution/uploadAuthorizeFile"
      name="authorizeFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="successFn"
      :on-error="error"
      :limit="2"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div class="el-upload__tip" slot="tip">文件大小应在1M以内</div>
      <div class="el-upload__tip" slot="tip">文件支持png、jpg、jpeg、pdf格式</div>
      <div class="el-upload__tip" slot="tip">请上传营业执照原照或复印件加盖公章照以及企业机构授权你注册的授权文件</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    success: {
      type: Function
    }
  },
  data() {
    return {
    }
  },
  methods: {
    successFn(response, file, fileList) {
      this.$message({
          type: response.resCode === '0000'?'success':'error',
          message: response.resMsg || response.msg
        })
      if(response.resCode === '0000'){
        this.success(response, file, fileList)
      }else{
        fileList.pop()
      }
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    error(res) {
      console.log(res)
    }
  }
}
</script>
<style>
.el-upload__tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  line-height: 17px;
}
</style>