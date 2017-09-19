<template>
<div class="model">
<header class="toolbar toolbar-header">
  <h1 class="title">添加群组</h1>
</header>
<section>
<form>
  <div class="form-group">
    <label>所在群组</label>
    <input :value="parentAddr" type="text" class="form-control" disabled="disabled">
  </div>
  <div class="form-group">
    <label>名称</label>
    <input v-model="name" type="text" class="form-control" placeholder="">
  </div>
  <div class="form-group">
    <label>地址</label>
    <input v-model="addr" type="text" class="form-control" placeholder="">
  </div>
</form>
</section>
<footer class="toolbar toolbar-footer">
  <div class="toolbar-actions">
    <button @click="cancel" class="btn btn-default">
      取消
    </button>

    <button @click="submit" class="btn btn-primary pull-right">
      保存
    </button>
  </div>
</footer>
</div>
</template>

<script>
  export default {
    props: ['parentGroup'],
    data () {
      return {
        name: '',
        addr: 0
      }
    },
    computed: {
      parentAddr: function () {
        console.log('this.parentGroup', this.parentGroup)
        return this.parentGroup ? this.parentGroup.addr() : ''
      }
    },
    mounted: function () {
      this.addr = this.parentGroup.subs.length
    },
    methods: {
      reset: function () {
        this.name = ''
        this.addr = 0
      },
      cancel: function () {
        this.$emit('cancelGroupModel')
        this.reset()
      },
      submit: function () {
        this.$emit('submitGroupModel', {name: this.name, addr: this.addr})
        this.reset()
      }
    }
  }
</script>

<style>
  /* CSS */
  .model { position: absolute; z-index: 999; background: #fff; width: 400px; left: 50%; top: 50%; margin: -200px 0 0 -100px; border: 1px solid #ccc; box-shadow: 0 1px 1px rgba(0,0,0,.1)}
  .model section { padding: 15px; }
</style>
