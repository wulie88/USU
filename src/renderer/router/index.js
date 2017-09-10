import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/result',
      name: 'result-page',
      component: require('@/components/ResultPage')
    },
    {
      path: '/grouping',
      name: 'grouping-page',
      component: require('@/components/GroupingPage')
    },
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
