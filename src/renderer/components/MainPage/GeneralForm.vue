<template>
  <form>
    <base-form :formData="formData"></base-form>

    <footer class="form-footer">
      <label>修改后请点击保存</label>
      <button type="button" class="form-control btn btn-form btn-primary" @click="save">保存</button>
    </footer>
  </form>
</template>

<script>
  import Device from '@/services/device'
  import BaseForm from './../BaseForm'
  export default {
    components: { BaseForm },
    props: ['name'],
    data () {
      return {
        formData: [{
          type: 'input',
          name: 'daley',
          title: '总线电压恢复后通讯延时2-255',
          val: '2'
        }, {
          type: 'checkbox',
          name: 'numberLimitEnable',
          title: '不限制报文数量',
          val: true
        }, {
          type: 'input',
          name: 'numberLimitMax',
          title: '单周期最大报文传输量1-255',
          val: '20'
        }, {
          type: 'select',
          name: 'numberLimitPeriod',
          title: '周期时间',
          data: {
            0: '50ms',
            1: '100ms',
            2: '200ms',
            3: '500ms',
            4: '1s',
            5: '2s',
            6: '5s',
            7: '10s',
            8: '30s',
            9: '1m'
          },
          val: 7
        }, {
          type: 'select',
          name: 'transmitDays',
          title: '阀值更新时间周期',
          data: {
            0: '7days',
            1: '14days',
            2: '30days'
          },
          val: 2
        }, {
          type: 'select',
          name: 'transmitPeriod',
          title: '单次阀值更新时间',
          data: {
            0: '1min',
            1: '2min',
            2: '5min'
          },
          val: 1
        }]
      }
    },
    methods: {
      save () {
        let d = [parseInt(this.formData[0].val), this.formData[1].val + 0, parseInt(this.formData[2].val), parseInt(this.formData[3].val), this.formData[4].val + 0, parseInt(this.formData[5].val)]
        this.$emit('submitFrameConfig', new Device.FrameConfig(this.name, d))
      }
    }
  }
</script>

<style>
form { padding: 30px 15px; }
.form-footer { margin-top: 50px; }
</style>