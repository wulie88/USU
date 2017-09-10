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
          title: '按键等待延时1-255(0.1s为单位)',
          val: '2'
        }, {
          type: 'select',
          name: 'buttonSendKey',
          title: '按键发送值',
          data: {0: '开启', 1: '关闭', 2: '反转', 3: '发送2bit固定值', 4: '发送1bit固定值'},
          val: 0
        }, {
          type: 'select',
          name: 'ABSendKey',
          title: 'A+B发送值',
          data: {0: '开启', 1: '关闭', 2: '反转', 3: '发送2bit固定值', 4: '发送1bit固定值'},
          val: 0
        }, {
          type: 'select',
          name: 'BCSendKey',
          title: 'B+C发送值',
          data: {0: '开启', 1: '关闭', 2: '反转', 3: '发送2bit固定值', 4: '发送1bit固定值'},
          val: 0
        }, {
          type: 'select',
          name: 'CDSendKey',
          title: 'C+D发送值',
          data: {0: '开启', 1: '关闭', 2: '反转', 3: '发送2bit固定值', 4: '发送1bit固定值'},
          val: 0
        }]
      }
    },
    methods: {
      save () {
        let d = [parseInt(this.formData[0].val), parseInt(this.formData[1].val), parseInt(this.formData[2].val), parseInt(this.formData[3].val)]
        this.$emit('submitFrameConfig', new Device.FrameConfig(this.name, d))
      }
    }
  }
</script>

<style>
form { padding: 30px 15px; }
.form-footer { margin-top: 50px; }
</style>