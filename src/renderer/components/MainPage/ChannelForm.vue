<template>
  <form>
  	<label>配置: {{name}}</label>
	<div class="form-group">
		<label>通道功能</label>
		<select v-model="type" class="form-control">
		  <option value="1">开关</option>
		  <option value="2">开关/调光</option>
		  <option value="3">窗帘</option>
		</select>
	</div>
	<!-- 开关 -->
	<template v-if="type == '1'">
	    <div class="form-group">
	      <label>长短按键区分</label>
	      <select v-model="button.distinction" class="form-control">
	        <option value="0">不区分</option>
	        <option value="1">区分</option>
	      </select>
	    </div>
	    <!-- 不区分 -->
	    <template v-if="button.distinction == '0'">
	      	<div class="form-group">
	      		<label>触点闭合动作（上升沿）</label>
	            <select v-model="button.withoutDistinction.r1" class="form-control">
	              <option value="0">开启</option>
			      <option value="1">关闭</option>
			      <option value="2">反转</option>
			      <option value="3">无动作</option>
			    </select>
	      	</div>
	      	<div class="form-group">
	      		<label>触点打开动作（下降沿）</label>
	            <select v-model="button.withoutDistinction.r2" class="form-control">
	              <option value="0">开启</option>
			      <option value="1">关闭</option>
			      <option value="2">反转</option>
			      <option value="3">无动作</option>
			    </select>
	      	</div>
	    </template>
	    <!-- 区分 -->
	    <template v-else>
	      	<div class="form-group">
	      		<label>节点类型</label>
	            <select v-model="button.withDistinction.r0" class="form-control">
	              <option value="0">常闭</option>
			      <option value="1">常开</option>
			    </select>
	      	</div>
	      	<div class="form-group">
	      		<label>短按反应</label>
	            <select v-model="button.withDistinction.r1" class="form-control">
	              <option value="0">开启</option>
			      <option value="1">关闭</option>
			      <option value="2">反转</option>
			      <option value="3">无动作</option>
			    </select>
	      	</div>
	      	<div class="form-group">
	      		<label>长按反应</label>
	            <select v-model="button.withDistinction.r2" class="form-control">
	              <option value="0">开启</option>
			      <option value="1">关闭</option>
			      <option value="2">反转</option>
			      <option value="3">无动作</option>
			    </select>
	      	</div>
			<div class="form-group">
				<label>长按反应时间2-255(单位100ms)</label>
				<input  v-model="button.withDistinction.r4" type="text" class="form-control">
			</div>
	      	<div class="form-group">
	      		<label>长短按键操作对象</label>
	            <select v-model="button.withDistinction.r5" class="form-control">
	              <option value="0">1个</option>
			      <option value="1">2个</option>
			    </select>
	      	</div>
	    </template>
	</template>

	<!-- 开关/调光 -->
	<template v-else-if="type == '2'">
	    <div class="form-group">
	      <label>节点类型</label>
	      <select v-model="dimmer.r0" class="form-control">
	        <option value="0">常开</option>
	        <option value="1">常闭</option>
	      </select>
	    </div>
	    <div class="form-group">
	      <label>调光功能</label>
	      <select v-model="dimmer.r1" class="form-control">
	        <option value="0">调光加开关</option>
	        <option value="1">只调光</option>
	      </select>
	    </div>
      	<div class="form-group">
      		<label>短按反应</label>
            <select v-model="dimmer.r2" class="form-control">
              <option value="0">开启</option>
		      <option value="1">关闭</option>
		      <option value="2">反转</option>
		      <option value="3">无动作</option>
		    </select>
      	</div>
      	<div class="form-group">
      		<label>长按反应</label>
            <select v-model="dimmer.r3" class="form-control">
              <option value="0">亮度增加</option>
		      <option value="1">亮度减小</option>
		      <option value="2">亮度循环</option>
		    </select>
      	</div>
		<div class="form-group">
			<label>长按反应时间3-255(单位100ms)</label>
			<input  v-model="dimmer.r5" type="text" class="form-control">
		</div>
	</template>

	<!-- 窗帘 -->
	<template v-else-if="type == '3'">
	    <div class="form-group">
	      <label>节点类型</label>
	      <select v-model="curtain.r1" class="form-control">
	        <option value="0">常开</option>
	        <option value="1">常闭</option>
	      </select>
	    </div>
      	<div class="form-group">
      		<label>长按反应</label>
            <select v-model="curtain.r3" class="form-control">
              <option value="0">上升</option>
		      <option value="1">下降</option>
		      <option value="2">反转</option>
		    </select>
      	</div>
		<div class="form-group">
			<label>长按反应时间3-255(单位100ms)</label>
			<input  v-model="curtain.r4" type="text" class="form-control">
		</div>
	</template>

    <footer class="form-footer">
      <label>修改后请点击保存</label>
      <button type="button" class="form-control btn btn-form btn-primary" @click="save">保存</button>
    </footer>
  </form>
</template>

<script>
  import Device from '@/services/device'
  export default {
    data () {
      return {
        type: '1',
        button: {
          distinction: '0',
          withoutDistinction: { // 不区分
            r0: 0, // 预留
            r1: '3', // 触点闭合动作（上升沿）
            r2: '2', // 触点打开动作（下降沿）
            r3: 0, // 预留
            r4: 0, // 预留
            r5: 0, // 预留
            r6: 0 // 预留
          },
          withDistinction: { // 区分
            r0: '1', // 节点类型
            r1: '2', // 短按反应
            r2: '2', // 长按反应
            r3: 0, // x预留
            r4: '2', // 长按反应时间
            r5: '0', // 长短按键操作对象
            r6: 2, // 防跳变输入封锁时间
            r7: 0 // x预留
          }
        },
        dimmer: {
          r0: '0', // 节点类型
          r1: '0', // 调光功能
          r2: '2', // 短按反应
          r3: '2', // 长按反应
          r4: 0, // x预留
          r5: '3', // 长按反应时间
          r6: 0, // x调光模式
          r7: 0, // x每次亮度增加
          r8: 0, // x发送周期
          r9: 2 // x防跳变输入封锁时间
        },
        curtain: {
          r0: 0, // 操作功能
          r1: '0', // 节点类型
          r2: 0, // 短按反应
          r3: '2', // 长按反应
          r4: '3', // 长按反应时间
          r5: 0, // 停止/调整信息发送周期
          r6: 2, // 防跳变输入封锁时间
        }
      }
    },
    props: ['name'],
    methods: {
      save () {
        let channelIndex = ['channelA', 'channelB', 'channelC', 'channelD'].indexOf(this.name)
        console.log('channelIndex', channelIndex)

        /**
         * 以下yu通道无关
         */
        let ds = []
        let os = []
        if (this.type === '1') {
          if (this.button.distinction === '0') {
            // 开关--不区分
            ds = [0].concat(Device.merge(this.button.withoutDistinction, 7))
            // 只有一个通讯对象
            os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '开关'))
          } else {
            // 开关--区分
            ds = [1].concat(Device.merge(this.button.withDistinction, 8))
            if (this.button.withDistinction.r5 === '0') {
              // 只有一个通讯对象
              os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '开关'))
            } else {
              // 两个通讯对象
              os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '开关[短按]'))
              os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '开关[长按]'))
            }
          }
        } else if (this.type === '2') {
          // 开关/调光
          ds = Device.merge(this.dimmer, 10)
          if (this.dimmer.r1 === '0') { // 调光+开关
            // 两个通讯对象
            os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '开关/调光[开关]'))
            os.push(new Device.CObject(Device.CObject.CT, Device.CObject.UINT4, channelIndex, '开关/调光[调光]'))
          } else {
            // 只有调光
            os.push(new Device.CObject(Device.CObject.CT, Device.CObject.UINT4, channelIndex, '开关/调光[只调光]'))
          }
        } else if (this.type === '3') {
          // 窗帘
          ds = Device.merge(this.curtain, 7)
          // 两个通讯对象
          os.push(new Device.CObject(Device.CObject.CWT, Device.CObject.UINT1, channelIndex, '窗帘[上移/下降]'))
          os.push(new Device.CObject(Device.CObject.CT, Device.CObject.UINT1, channelIndex, '窗帘[停止]'))
        }

        // 合并
        ds = [parseInt(this.type)].concat(ds)
        this.$emit('submitFrameConfig', new Device.FrameConfig(this.name, ds, os))
      }
    }
  }
</script>