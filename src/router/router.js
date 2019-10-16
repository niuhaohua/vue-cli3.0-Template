import Vue from "vue";
import Router from "vue-router";
import Wrapper from '../views/wrapper'
import Account from '../views/systemManage/account.vue'
Vue.use(Router)

export const constantRoutes = [{
    path: "/login",
    name: "login",
    component: () => import('../views/login.vue')
  },
  {
    path: "/",
    name: "wrapper",
    component: Wrapper,
    redirect: 'dsList',
    children: [{
      path: "dsList",
      name: "dsList",
      component: () => import('../views/dsList/index.vue'),
      meta: {
        requiresAuth: true,
        title: '数据源列表',
        icon: 'ds-icon'
      }
    }]
  },
  {
    path: '/groupManage',
    name: "groupManage",
    redirect: '/groupManage/index',
    component: Wrapper,
    meta: {
      title: '机构管理',
      icon: 'home'
    },
    children: [{
      path: 'index',
      component: () => import('../views/groupManage/groupList.vue'),
      name: 'index',
      meta: {
        title: '机构管理',
        icon: 'home'
      }
    }, {
      path: 'groupAccount',
      component: () => import('../views/groupManage/groupAccount.vue'),
      name: 'groupAccount',
      hidden: true,
      meta: {
        title: '子账号管理',
        icon: 'home',
        activeMenu: '/groupManage/index'
      }
    }]
  },
  {
    path: '/dsReview',
    name: "dsReview",
    redirect: '/dsReview/dsOrder',
    component: Wrapper,
    meta: {
      title: '数据源审批',
      icon: 'group-icon'
    },
    children: [{
      path: 'dsOrder',
      component: () => import('../views/dsReview/dsOrder.vue'),
      name: 'dsOrder',
      meta: {
        title: '数据源审批',
        icon: 'group-icon'
      }
    }, {
      path: 'allDsOrder',
      component: () => import('../views/dsReview/allDsOrder.vue'),
      name: 'allDsOrder',
      hidden: true,
      meta: {
        title: '全部机构订单',
        icon: 'group-icon',
        activeMenu: '/dsReview/dsOrder'
      }
    }, ]
  }
]

export const authRoutes = [{
  path: '/systemManage',
  name: "systemManage",
  redirect: 'noRedirect',
  component: Wrapper,
  meta: {
    title: '系统管理',
    icon: 'system-icon',
    roles: ['manage-3020', 'manage-3010']
  },
  children: [{
      path: 'account',
      component: Account,
      name: 'account',
      meta: {
        title: '账号管理',
        roles: ['manage-3020']
      }
    },
    {
      path: 'roles',
      component: () => import('../views/systemManage/roles.vue'),
      name: 'roles',
      meta: {
        title: '角色管理',
        roles: ['manage-3010']
      }
    }
  ]
}]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: "/adms/",
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router