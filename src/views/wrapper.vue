<template>
  <div class="wrapper">
    <div class="app-wrapper">
      <top-header />
      <div class="main-container">
        <left-nav class="sidebar-container" />
        <section class="app-main">
          <div class="tag">
            <Breadcrumb />
          </div>
          <transition name="fade-transform" mode="out-in">
            <router-view :key="key"/>
          </transition>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import TopHeader from "@/components/HeaderNav/index.vue";
import LeftNav from "@/components/LeftNav/index.vue";
import Breadcrumb from '@//components/Breadcrumb/index.vue'
export default {
  name: "wrapper",

  components: {
    TopHeader,
    LeftNav,
    Breadcrumb,
  },
  computed: {
    key() {
      return this.$router.fullPath
    },

  },
};
</script>
<style scoped>
.main-container {
  padding-top: 72px;
}
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 72px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #edf0ef;
  padding: 0 17px 17px 17px;
  box-sizing: border-box;
}
.tag {
  height: 40px;
}
.fixed-header + .app-main {
  padding-top: 72px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>