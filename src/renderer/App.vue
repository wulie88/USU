<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'USU2',
    mounted () {
      console.log(this.$router.currentRoute)
    }
  }
</script>

<style>
  /* CSS */
  @import "../../static/photon/css/photon.min.css";
</style>
