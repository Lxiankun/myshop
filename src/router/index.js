import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',

    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    children: [
      {
        path: '/home',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: () => import('@/components/Welcome.vue'),
      },
      {
        path: '/users',
        component: () => import('@/components/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/Categories.vue')
      },
      {
        path: '/params',
        component: () => import('@/components/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/components/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/components/goods/Add.vue')
      },
      {
        path: '/orders',
        component: () => import('@/components/order/Order.vue')
      },
      {
        path: '/reports',
        component: () => import('@/components/report/Report.vue')
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  if (to.fullPath == '/login') {
    next();
  } else {
    const token_ = window.sessionStorage.getItem('token');
    if (!token_) {
      next('/login');
    }
    next();
  }


});
export default router
