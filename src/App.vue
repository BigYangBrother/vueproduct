<template>
  <div id="app">
  	<nav-header></nav-header>
	<bread></bread>
    <router-view></router-view>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/Header'
import NavFooter from '@/components/Footer'
import Bread from '@/components/Bread'
export default {
  name: 'app',
  components:{
  	NavHeader,
  	NavFooter,
  	Bread
  }
}
</script>

<style>
  .left{
    width:20%;
    border: 1px solid gray;
    float: left;
  }
</style>
