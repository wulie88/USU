<template>
<div class="console">
<header class="toolbar toolbar-header">
  <h1 class="title">控制台</h1>

  <div class="toolbar-actions">
    <button @click="close" class="btn btn-default pull-right">
      <span class="icon icon-cancel"></span>
    </button>
  </div>
</header>
<section>
<div class="lines">
  <p v-for="line in lines">{{line}}</p>
</div>
</section>
<footer class="toolbar toolbar-footer">
</footer>
</div>
</template>

<script>
  export default {
    props: ['lines'],
    data () {
      return {
      }
    },
    methods: {
      close: function () {
        this.$emit('closeConsole')
      }
    }
  }
</script>

<style>
  /* CSS */
  .console { position: absolute; z-index: 999; background: #fff; width: 600px; left: 50%; top: 50%; margin: -250px 0 0 -300px; border: 1px solid #ccc; box-shadow: 0 1px 1px rgba(0,0,0,.1);}
  .console section { padding: 15px; height: 500px; overflow-y: auto; }
  .console .lines p { margin: 15px 0; font-size: 14px; line-height: 1.8; color: #bbb; }
</style>
