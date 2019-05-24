<template>
    <div class="col mt-5 text-center">
        <h1>404 Not Found</h1>
        <p>Sorry, an error has occured, Requested page not found!</p>
        <router-link :to="{ name: 'TodoList' }" class="btn btn-primary mt-3">Take me Home</router-link>
    </div>
</template>

<script>
    export default {
        name: 'PageNotFound'
    }
</script>

