import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Print from 'vue-print-nb'
import 'element-ui/lib/theme-chalk/index.css'
import './icons'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })
Vue.use(Print)

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  if (store.getters.getToken) {
    if (to.path === '/login') {
      // 如果已经登录，重定向到主页
      next()
    } else {
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.state.roles && store.state.roles.length > 0
      if (hasRoles) {
        // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        next()
      } else {
        try {
          // get user info
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const roles = []
          await store.dispatch('setRoles', store.getters.getToken)
          roles.push(store.getters.getRoles)
          // 根据角色生成可访问路由映射
          const accessRoutes = await store.dispatch('generateRoutes', roles)
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法 确保addRoutes已完成
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('resetToken')

          // eslint-disable-next-line no-undef
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
