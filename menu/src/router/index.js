import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/components/index'
import cx from '@/components/cx/cx'
import ct from '@/components/cx/ct'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
        path:"/cx",
        component: cx
    },
    {
        path:"/ct",
        component: ct
    }
  ]
})
