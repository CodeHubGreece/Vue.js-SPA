<template>
    <nav class="navbar navbar-light bg-white border-bottom shadow-sm">
        <router-link :to="{ name: 'TodoList' }" class="navbar-brand">
            <img src="@/assets/vue.png" style="height:35px" alt="Codehub"> Code.Learn Vue.js
        </router-link>

        <div class="dropdown" :class="{ show: show_menu}" v-if="initials">
            <a v-if="initials" href="#" @click.prevent="show_menu = !show_menu" :data-letters="initials"></a>
            <div class="dropdown-menu dropdown-menu-right" :class="{ show: show_menu}" aria-labelledby="dropdownMenuLink">
                <a v-if="token" href="#" @click.prevent="logout" class="dropdown-item">Logout</a>
            </div>
        </div>
    </nav>
</template>

<script>

    import { mapState } from 'vuex'

    export default {
        name: 'MyHeader',
        data(){
            return {
                show_menu: false
            }
        },
        computed: {
            ...mapState({
                token: state => state.token,
                user_details: state => state.user_details,
                initials(){
                    const { firstname, lastname } = this.user_details

                    if (firstname || lastname)
                        return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase()

                    return false
                }
            })
        },
        methods: {
            logout(){

                // Close Dropdown
                this.show_menu = false

                // Dispatch an Action and Mutate state's token
                this.$store.dispatch('updateToken', '')

                // Dispatch an Action and Mutate state's user details
                this.$store.dispatch('updateUserDetails', '')

                // Redirect to login
                this.$router.push({ name: 'Login' })
            }
        }
    }
</script>

<style>
    [data-letters]:before {
        content:attr(data-letters);
        display:inline-block;
        font-size:1em;
        width:2.5em;
        height:2.5em;
        line-height:2.5em;
        text-align:center;
        border-radius:50%;
        background:#41b883;
        vertical-align:middle;
        color:white;
    }
</style>
