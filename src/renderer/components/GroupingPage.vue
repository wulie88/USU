<template>
<div class="grouping">
	<section class="objs">
	  <div class="table">
		<header class="table-header">
			<span class="t0">Index</span>
			<span class="t1">Channel</span>
			<span class="t2">Type</span>
			<span class="t3">Group Addr</span>
		</header>
		<section class="table-body">
			<ul>
				<li v-for="obj in objs">
					<span class="t0">{{obj.index}}</span>
					<span class="t1">{{obj.belongTo | channel}}</span>
					<span class="t2">{{obj.deviceType | stringDeviceType}}</span>
					<span class="t3">Group Addr</span>
				</li>
			</ul>
		</section>
	  </div>
	</section>
	<section class="groups"></section>
</div>
</template>

<script>
  import Device from '@/services/device'
  export default {
    data () {
      return {
        objs: Device.CObject.All
      }
    },
    filters: {
      channel: function (index) {
        return ['channelA', 'channelB', 'channelC', 'channelD'][index]
      },
      stringDeviceType: function (index) {
        return ['-', '开关', '开关/调光'][index]
      }
    }
  }
</script>

<style>

  * {
    margin: 0;
    padding: 0;
  }
  .grouping { width: 100%; height: 100%; }
  .objs {height: 60%; width: 100%;}
  .groups {height: 40%; width: 100%;}
  .table span { display: inline-block; padding: 4px 10px; border-right: 1px solid #ddd; }
  .table {}
  .table-header { font-size: 14px; line-height: 2.2; border-bottom: 1px solid #ddd;}
  .table-body li {border-bottom: 1px solid #ddd;}
  .t0 { width: 80px; }
  .t1 { width: 100px; }
  .t2 { width: 100px; }
  .t3 { width: 300px; }
</style>