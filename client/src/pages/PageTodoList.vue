<template>
    <div class="col-xl-8 offset-xl-2">
        <div class="card mt-5">
            <article class="card-body">
                <div v-if="list_loading" class="spinner-cnt text-center">
                    <div class="spinner-border m-5" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <h4 class="card-title mb-4 mt-1">Todos</h4>
                <div class="input-group mb-3">
                    <input type="text" v-model="new_task" :disabled="btn_loading" class="form-control" @keyup.enter="addTask">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" :disabled="!new_task" @click.prevent="addTask">
                            Add Item
                         <span v-if="btn_loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <ul class="list-group">
                    <li class="list-group-item" v-for="(todo, index) in todo_list" :key="index">
                        <span :class="{ 'strike': todo.done == true }" @click.prevent="updateTask(todo)">{{todo.title}}</span>
                        <button type="button" class="btn btn-outline-danger btn-sm float-right" @click.prevent="removeTask(todo._id)">X</button>
                    </li>
                </ul>
            </article>
        </div>
    </div>
</template>

<script>

    import axios from 'axios'
    import { mapState } from 'vuex'

    export default {
        name: 'PageTodoList',
        data() {
            return {
                new_task: '',
                todo_list: [],
                btn_loading: false,
                list_loading: false
            }
        },
        computed: {
            ...mapState({
                token: state => state.token
            })
        },
        methods: {
            resetData(){
                this.new_task = ''
                this.btn_loading = false
                this.list_loading = false
            },
            addTask(){

                const { new_task } = this

                // Validate new_task check if empty
                if (!new_task){
                    alert('Please enter a task.')
                    return
                }

                // Check if loading is already true
                // avoid multiple calls to the server
                if (this.btn_loading) return

                // Start Loading
                this.btn_loading = true

                // Axios headers
                axios.defaults.headers.post['Token'] = this.token

                 // GET request to fetch token
                axios.post('todo-list', { title: new_task })
                    .then( response => {

                        const { _id, title, done } = response.data
                        this.todo_list.push({ _id, title, done })


                        // Stop Loading and reset data
                        this.resetData()

                    }).catch( () => {

                        // Stop Loading and reset data
                        this.resetData()
                    })

            },
            updateTask(todo){

                // Validate and check if empty
                if (!todo){
                    alert('An error occurred.')
                    return
                }

                // Check if loading is already true
                // avoid multiple calls to the server
                if (this.list_loading) return

                // Start Loading
                this.list_loading = true


                // Axios headers
                axios.defaults.headers.patch['Token'] = this.token

                 // PATCH
                axios.patch('todo-list/' + todo._id, { done: !todo.done})
                    .then( () => {

                        //Update Done state
                        todo.done = !todo.done

                        // Stop Loading and reset data
                        this.resetData()

                    }).catch( () => {

                        // Stop Loading and reset data
                        this.resetData()
                    })

            },
            removeTask(_id){

                // Validate and check if empty
                if (!_id){
                    alert('An error occurred.')
                    return
                }

                // Check if loading is already true
                // avoid multiple calls to the server
                if (this.list_loading) return

                // Start Loading
                this.list_loading = true

                // Axios headers
                axios.defaults.headers.delete['Token'] = this.token

                // DELETE request to delete task
                axios.delete('todo-list/' + _id)
                    .then( () => {

                        //Find Index in list and remove
                        const idx = this.todo_list.findIndex(f=>f._id == _id)

                        if (idx > -1)
                            this.todo_list.splice(idx, 1)

                        // Stop Loading and reset data
                        this.resetData()

                    }).catch( () => {

                        // Stop Loading and reset data
                        this.resetData()
                    })

            },
            getTasks(){

                // Check if loading is already true
                // avoid multiple calls to the server
                if (this.list_loading) return

                // Start Loading
                this.list_loading = true

                // Axios headers
                axios.defaults.headers.get['Token'] = this.token

                // GET request to fetch the list
                axios.get('todo-list')
                    .then( response => {

                        if (response.data && response.data.todo_list)
                            this.todo_list = response.data.todo_list

                        // Stop Loading and reset data
                        this.resetData()

                    }).catch( () => {

                        // Stop Loading and reset data
                        this.resetData()
                    })
            }
        },
        mounted(){
            this.getTasks()
        }
    }
</script>

<style>
    .strike{
        text-decoration: line-through;
        color: gray;
    }
    .spinner-cnt{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 10;
        background: white;
    }
</style>


