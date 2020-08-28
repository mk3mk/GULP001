import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import TestScss from './Components/test-scss.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.component('test-scss', TestScss)

const routes = [
    {
        path: '/',
        component: App
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

new Vue({
    el: '#app',
    template: "<div><router-view></router-view></div>",
    router
})