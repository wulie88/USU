<template>
<div id="result" class="window">
  <form>
    <div v-for="item in items">
	  <div class="form-group">
	    <label>{{item.name}}</label>
	    <input :value="item | dump" type="text" class="form-control">
	  </div>
    </div>
    <footer class="form-footer">
      <button type="button" class="form-control btn btn-form" @click="restart">重新开始</button>
    </footer>
  </form>
</div>
</template>

<script>
  import Device from '@/services/device'
  export default {
    data () {
      return {
        items: []
      }
    },
    mounted: function () {
      this.items = Device.manager.dump()
      console.log(this.items)
    },
    methods: {
      restart: function () {
        this.$router.replace('/')
      }
    },
    filters: {
      dump: function (d) {
        return d.dump()
      }
    }
  }
</script>

<style type="text/css">
	#result form { padding: 30px 15px; box-sizing: border-box; width: 100%; height: 100%; }
</style>