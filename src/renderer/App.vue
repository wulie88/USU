<template>
  <div id="app" class="window">
    <div class="window-content">
    	<router-view></router-view>
    </div>
	<footer class="toolbar toolbar-footer">
	  <div class="toolbar-actions">
	    <button v-show="$router.currentRoute.path === '/grouping'" @click="prev" class="btn btn-default">
	      上一步
	    </button>

	    <button v-show="$router.currentRoute.path === '/grouping'" class="btn btn-primary pull-right">
	      写入
	    </button>
	  </div>
	</footer>
  </div>
</template>

<script>
  export default {
    name: 'USU2',
    mounted () {
      console.log(this.$router.currentRoute)
    },
    methods: {
      prev () {
        this.$router.replace('/')
      }
    }
  }
</script>

<style>
  /* CSS */
  @import "../../static/photon/css/photon.min.css";
</style>
