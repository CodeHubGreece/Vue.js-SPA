//Add Vuex
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') === null ? "" : localStorage.token,
        user_details: localStorage.getItem('user_details') === null ? {} : JSON.parse(localStorage.user_details)
    },
    actions: {
        updateToken({ commit }, token) {
            commit( 'setToken', token)
        },
        updateUserDetails({ commit }, data) {
            commit( 'setUserDetails', data)
        }
    },
    mutations: {
        setToken(state, payload){
            state.token = payload

            //Update localstorage also
            if (!payload || payload == '')
                localStorage.removeItem('token')
            else
                localStorage.setItem('token', payload)
        },
        setUserDetails(state, payload) {
            state.user_details = payload

            //Update localstorage also
            if (!payload || payload == "")
                localStorage.removeItem('user_details')
            else
                localStorage.setItem('user_details', JSON.stringify(payload))
        },
    }
})
