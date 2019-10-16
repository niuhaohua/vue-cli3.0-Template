<template>
  <div class="navbar">
    <div class="logo">
      <img src="../../assets/img/header-logo.png" alt />
      <div class="right" v-if="loginUrl">
        <div class="avatar">
          <img
            src="https://c-ssl.duitang.com/uploads/item/201711/10/20171110225150_ym2jw.thumb.700_0.jpeg"
            alt
          />
        </div>
        <div class="text">
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
              <span class="username">{{userName}}</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:block;" @click="logout">登出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // loginUrl:
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    },
    loginUrl() {
      return this.$store.state.user.name ? true : false
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
}
</script>
<style scoped>
.navbar {
  height: 72px;
  overflow: hidden;
  position: fixed;
  top: 0;
  background-image: linear-gradient(180deg, #29314e 0%, #1f263c 100%);
  /* box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); */
  z-index: 1002;
  width: 100%;
}
.logo {
  margin-left: 34px;
  margin-top: 15px;
}
.right {
  float: right;
  margin-right: 17px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  float: left;
  margin-right: 8px;
}
.avatar img {
  display: inline-block;
  width: 100%;
}
.text,
.avatar-wrapper {
  float: left;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: -0.29px;
  line-height: 40px;
  cursor: pointer;
}
.username {
  padding-right: 10px;
}
</style>