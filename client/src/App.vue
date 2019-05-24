<template>
  <div id="app">
      <my-header></my-header>
      <div class="container">
          <div class="row">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
          </div>
      </div>
  </div>
</template>

<script>
    import MyHeader from './components/MyHeader'

    export default {
        name: 'App',
        components: {
            MyHeader
        }
    }
</script>

<style>
    /* Classes to add a face css transition between Vue Router pages*/
    .fade-enter-active, .fade-leave-active {
        transition-duration: 0.25s;
        transition-property: opacity;
        transition-timing-function: ease;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>


