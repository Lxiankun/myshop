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
    component: () => import('@/components/Home.vue')
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
