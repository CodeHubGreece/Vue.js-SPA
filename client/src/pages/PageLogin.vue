<template>
    <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">

        <a href="//www.codehub.gr">
            <img src="@/assets/codehub.png" class="mx-auto d-block mt-5" alt="CodeHub">
        </a>

        <div class="card mt-4">
            <article class="card-body">
                <h4 class="card-title mb-4 mt-1">Sign in</h4>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input v-model="email" name="email" class="form-control" placeholder="Enter your email" type="email" :disabled="loading" @keyup.enter="submitForm"/>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input v-model="password" name="password" class="form-control" placeholder="Enter your password" type="password" :disabled="loading" @keyup.enter="submitForm"/>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <button class="btn btn-primary" :disabled="!email || !password" @click.prevent="submitForm">
                                    Login
                                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                 <!-- Alert box for errors -->
                <div v-if="alert" class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
                    {{alertMsg}}
                    <button type="button" class="close" @click="resetAlert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

            </article>


        </div>
    </div>
</template>

<script>

    import axios from 'axios'

    export default {
        name: 'PageLogin',
        data() {
            return {
                email: '',
                password: '',
                loading: false,
                alert: false,
                alertMsg: ''
            }
        },
        methods: {
            resetData(){
                this.email = ''
                this.password = ''
                this.loading = false
            },
            resetAlert(){
                this.alert = false,
                this.alertMsg = ''
            },
            submitForm(){

                const { email, password } = this

                // Validate email and password and check if empty
                if (!email || !password){
                    alert('Please fill email and password.')
                    return
                }

                // Check if loading is already true
                // avoid multiple calls to the server
                if (this.loading) return

                // Start Loading
                this.loading = true

                // Hide Alert
                this.resetAlert()

                // GET request to fetch token
                axios.post('auth', { email, password })
                    .then( response => {

                        // handle success
                        const { token, firstname, lastname } = response.data;

                        if (token){
                            // Dispatch a Vuex action and update state's token
                            this.$store.dispatch('updateToken', token)

                            // Dispatch a Vuex action and update user's Details (firstname, lastname etc)
                            this.$store.dispatch('updateUserDetails', { firstname, lastname })

                            // Redirect to TodoList Page
                            this.$router.push({ name: 'TodoList' })
                        }

                        // Stop Loading and reset data
                        this.resetData()
                    })
                    .catch( error => {

                        // Stop Loading and reset data
                        this.resetData()

                        // Show alert
                        this.alert = true

                        if (error.response && error.response.status == 403){
                            this.alertMsg = 'Wrong email or password. Please try again.'
                        } else{
                            this.alertMsg = 'An error occurred. Please try again.'
                        }
                    })
            }
        }
    }
</script>
