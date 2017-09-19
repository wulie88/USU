<template>
<div id="result" class="window">
  <form>
    <div class="form-merge">
      <div class="form-merge-item">
        <div class="form-group">
          <label>区(0-15)</label>
          <input v-model="darea" type="text" class="form-control">
        </div>
      </div>
      <div class="form-merge-item">
        <div class="form-group">
          <label>线路(0-15)</label>
          <input v-model="dline" type="text" class="form-control">
        </div>
      </div>
      <div class="form-merge-item">
        <div class="form-group">
          <label>总线设备(0-255)</label>
          <input v-model="dbus"type="text" class="form-control">
        </div>
      </div>
      <div class="form-merge-item">
        <div class="form-group">
          <label>预览</label>
          <p>{{dd}}</p>
        </div>
      </div>
    </div>
    <div class="form-merge">
      <div class="form-merge-item">
        <div class="form-group">
          <label>串口</label>
          <input v-model="port" type="text" class="form-control">
        </div>
      </div>
      <div class="form-merge-item">
        <div class="form-group">
          <label>确认写入</label>
          <button @click="write" type="button" class="form-control btn btn-primary">写入</button>
        </div>
      </div>
      <div class="form-merge-item">
        <div class="form-group">
          <label>&nbsp;</label>
          <button @click="restartDevice" type="button" class="form-control btn btn-warning">重启设备</button>
        </div>
      </div>
    </div>
    <div v-for="item in items" class="form-group">
      <label>{{item.name}}</label>
      <input :value="item | dump" type="text" class="form-control">
    </div>
    <footer class="form-footer">
      <button type="button" class="form-control btn btn-form" @click="reset">重新开始</button>
    </footer>
  </form>
  <console-module :lines="consoleLines" @closeConsole="receivedCloseFromClild" v-if="showModel"></console-module>
</div>
</template>

<script>
  import Device from '@/services/device'
  import ConsoleModule from './ResultPage/ConsoleModule'
  export default {
    components: { ConsoleModule },
    data () {
      return {
        darea: 1,
        dline: 1,
        dbus: 13,
        items: [],
        port: 'COM3',
        showModel: false,
        consoleLines: []
      }
    },
    computed: {
      dd: function () {
        let addr0 = parseInt(this.darea) << 4 | parseInt(this.dline)
        let addr1 = parseInt(this.dbus)
        Device.manager.setAddr(addr0, addr1)
        this.items = Device.manager.dump()
        return ['0x' + addr0.toString(16), '0x' + addr1.toString(16)].join(' ')
      }
    },
    mounted: function () {
      this.items = Device.manager.dump()
      console.log(this.items)
    },
    methods: {
      reset: function () {
        this.$router.replace('/')
      },
      receivedCloseFromClild: function () {
        this.showModel = false
      },
      restartDevice: function () { },
      write: function () {}
    },
    filters: {
      dump: function (d) {
        return d.dump()
      }
    }
  }
</script>

<style type="text/css">
	#result form { padding: 30px 15px; box-sizing: border-box; width: 100%; height: 100%; overflow-y: auto; }
  .form-merge { display: flex; }
  .form-merge .form-merge-item { flex: 1; padding: 10px; }
</style>