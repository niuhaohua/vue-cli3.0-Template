<template>
  <div class="page-main" v-loading="loading">
    <!-- <water-fall-component :width="300" :list="packageList"/> -->
    <Card :data-list="packageList" />
    <up-top />
  </div>
</template>

<script>
import Card from './components/card'
import UpTop from '@/components/UpTop/upTop'
export default {
  components: {
    Card,
    UpTop
  },
  mounted() {
  },
  computed: {

  },
  data() {
    return {
      packageList: [],
      loading: true
    }
  },
  mounted() {
    this.getDsList()
  },
  methods: {
    getDsList() {
      this.loading = true
      this.$api.post('/dataSource/findAllDataSource', {}, res => {
        this.packageList = res.data
        this.loading = false
      })
    }
  }
}
</script>

  

