import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import routerManage from './modules/routerManage'
import getters from './getter'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
      user,
      routerManage
    },
    getters
})

export default store
