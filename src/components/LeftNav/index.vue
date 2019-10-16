<template>
  <div :class="{'has-logo':false}">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#ffffff"
        text-color="rgba(0,0,0,0.75)"
        :unique-opened="false"
        active-text-color="#5E97F0"
        :collapse-transition="false"
        mode="vertical"
      >
      <sidebar-item v-for="(route,index) in routes" :key="index" :item="route" :base-path="route.path" />
      </el-menu>
     
    </el-scrollbar>
  </div>
</template>
<script>

import SidebarItem from './sideBarItem'
export default {
  components: { SidebarItem },
  computed: {
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
     isCollapse() {
      return false
    }
  }

}
</script>