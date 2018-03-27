import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import cyone from '@/components/cy/cyone'
import cytwo from '@/components/cy/cytwo'
import datail from '../views/datail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/index',
      component: index
    },
    {
      path: '/cyone',
      component: cyone
    },
    {
      path: '/cytwo',
      component: cytwo
    },
    {
      path: '/datail',
      component: datail
    }
  ]
})
