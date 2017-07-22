import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import MapView from '@/components/home/hackingmap/MapView.vue'
import ListView from '@/components/home/hackingmap/ListView.vue'
import FullMapView from '@/components/home/hackingmap/FullMapView'
import AdminView from '@/components/AdminView'
import MentorView from '@/components/MentorView'
import AskMentor from '@/components/AskMentor'
import LiveAwards from '@/components/LiveAwards'
import Speaker from '@/components/Speaker'
import Expo from '@/components/Expo'
// import User from '@/components/user/User'
// import Profile from '@/components/user/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '*', redirect: '/projects' },
    {
      path: '/',
      component: Home,
      children: [
        { path: 'map', component: MapView, name: 'Map' },
        { path: 'projects', component: ListView },
        { path: 'full_map', component: FullMapView },
        { path: '', redirect: '/projects' }
      ]
    },
    { path: '/admin', component: AdminView },
    { path: '/mentor', component: MentorView },
    { path: '/askMentor', component: AskMentor },
    { path: '/liveAwards', component: LiveAwards },
    { path: '/speaker', component: Speaker },
    { path: '/expo', component: Expo }
    // {
    //   path: '/user',
    //   component: User,
    //   children: [
    //     { path: '/user/profile', component: Profile }
    //   ]
    // }
  ]
})
