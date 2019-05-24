import Vue from 'vue'

//Import our main App vue component
import App from './App.vue'

Vue.config.productionTip = false

import axios from 'axios'

// Axios Defaults
axios.defaults.baseURL = 'https://h21b912lm9.execute-api.eu-west-1.amazonaws.com/latest'

//Import Vuex store in order to access globally in the app
//for example this.$store.dispatch, this.$store.getters etc.
import store from './store'

//Add Vue Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)


//Pages
import PageLogin from './pages/PageLogin'
import PageNotFound from './pages/PageNotFound'
import PageTodoList from './pages/PageTodoList'

//Vue Router
const router = new VueRouter({
    mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
    base: process.env.NODE_ENV === 'production' ? '/codehub-vue/' : '/',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: PageLogin
        },
        {
            path: '/todo-list',
            name: 'TodoList',
            component: PageTodoList,
            meta: {
                authorization: true
            }
        },
        {
            path: '*',
            name: 'PageNotFound',
            component: PageNotFound,
            meta: {
                authorization: true
            }
        },
    ]
})

// Vue Router Navigation Guard to redirect to Login (if the user is not logged in)
router.beforeEach((to, from, next) => {

    const token = localStorage.getItem('token')

    // Check the routes that have a meta authorization
    if (to.matched.some(record => record.meta.authorization)) {

      // This route requires an active token
      if (!token) {

        //Redirect to login page
        next({ name: 'Login' })
        return
      }

      // Show the page
      next()
      return
    }

    // In case of Login page, but with a token
    // Redirect to TodoList
    if (token && to.name === 'Login'){
        next({ name: 'TodoList' })
        return
    }

    // Show the page
    next()
})

// Vue instance with Vue Router + Vuex
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
