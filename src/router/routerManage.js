import router from './router'
import store from '../store/index'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
    getToken
} from '@/utils/token'


NProgress.configure({
    showSpinner: false
})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = getToken('ht-token')
    if (hasToken) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    const roles = await store.dispatch('user/userInfo')
                    const accessRoutes = await store.dispatch('routerManage/generateRoutes', roles)
                    router.options.routes = store.state.routerManage.routes
                    router.addRoutes(accessRoutes)
                    next({
                        ...to,
                        replace: true
                    })
                } catch (error) {
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})