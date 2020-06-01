import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const menu = [
  {
    path: '/',
    redirect: 'login',
    meta: {
      menu: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      menu: false
    }
  },
  {
    path: '/user',
    name: 'layoutYHGL',
    component: () => import('@/views/layout/Layout'),
    meta: {
      title: '用户管理',
      icon: 'el-icon-user',
      menu: true,
      funcNode: '1'
    },
    children: [
      {
        path: '/user/userList',
        name: 'UserList',
        component: () => import('@/views/user/UserList'),
        meta: {
          title: '用户列表',
          icon: 'el-icon-notebook-2',
          menu: true,
          funcNode: '1-1'
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/sys',
    name: 'layoutXTGL',
    component: () => import('@/views/layout/Layout'),
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
      menu: true,
      funcNode: '2',
      role: ['admin']
    },
    children: [
      {
        path: '/sys/sysLogList',
        name: 'SysLogList',
        component: () => import('@/views/sys/SysLogList'),
        meta: {
          title: '系统访问日志',
          icon: 'el-icon-notebook-1',
          menu: true,
          funcNode: '2-1',
          role: ['admin']
        }
      }
    ]
  },
  {
    path: '/book',
    name: 'book',
    component: () => import('@/views/layout/Layout'),
    meta: {
      title: '图书管理',
      icon: 'el-icon-reading',
      menu: true,
      funcNode: '3',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: '/book/bookManage',
        name: 'bookManage',
        component: () => import('@/views/book/bookManage'),
        meta: {
          title: '图书管理',
          icon: 'el-icon-notebook-2',
          menu: true,
          funcNode: '3-1',
          role: ['admin']
        }
      },
      {
        path: '/book/subBook',
        name: 'subBook',
        component: () => import('@/views/book/subBook'),
        meta: {
          title: '图书详情',
          icon: 'el-icon-notebook-1',
          menu: true,
          funcNode: '3-2',
          role: ['editor']
        }
      },
      {
        path: '/book/returnBook',
        name: 'returnBook',
        component: () => import('@/views/book/returnBook'),
        meta: {
          title: '图书归还',
          icon: 'el-icon-collection',
          menu: true,
          funcNode: '3-3',
          role: ['editor']
        }
      },
      {
        path: '/book/subUserManage',
        name: 'returnBook',
        component: () => import('@/views/book/subUserManage'),
        meta: {
          title: '借阅用户',
          icon: 'el-icon-document-copy',
          menu: true,
          funcNode: '3-4',
          role: ['admin']
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/layout/Layout'),
    meta: {
      title: '订单管理',
      icon: 'el-icon-setting',
      menu: true,
      funcNode: '4',
      role: ['admin']
    },
    children: [
      {
        path: '/orderBook',
        name: 'orderBook',
        component: () => import('@/views/order/orderBook'),
        meta: {
          title: '订单详情',
          icon: 'el-icon-notebook-1',
          menu: true,
          funcNode: '4-1',
          role: ['admin']
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: menu
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
