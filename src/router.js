import Vue from 'vue'
// import Router from 'vue-router'
import Router from './yVueRouter'
import Home from './components/Home.vue'
import About from './components/About.vue'

Vue.use(Router)

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About }
]
const router = new Router({
    routes // (缩写) 相当于 routes: routes
});

export default router