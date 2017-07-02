import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import MapView from '@/components/home/hackingmap/MapView.vue'
import ListView from '@/components/home/hackingmap/ListView.vue'
// import User from '@/components/user/User'
// import Profile from '@/components/user/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '*', redirect: '/map' },
    {
      path: '/',
      component: Home,
      children: [
        { path: 'map', component: MapView },
        { path: 'projects', component: ListView },
        { path: '', component: MapView }
      ]
    }
    // {
    //   path: '/user',
    //   component: User,
    //   children: [
    //     { path: '/user/profile', component: Profile }
    //   ]
    // }
  ]
})
