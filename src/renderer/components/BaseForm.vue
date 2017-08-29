<template>
  <section>
    <div v-for="(item, index) in formData">
      <div v-if="item.type === 'input'" class="form-group">
        <label>{{item.title}}</label>
        <input v-model='item.val' type="email" class="form-control" placeholder="Email">
      </div>

      <div v-if="item.type === 'checkbox'" class="checkbox">
        <label>
          <input v-model='item.val' type="checkbox"> {{item.title}}
        </label>
      </div>

      <div v-if="item.type === 'select'" class="form-group">
        <label>{{item.title}}</label>
        <select v-model='item.val' class="form-control">
          <option v-for="(i, n) in item.data" :value="n">{{i}}</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['formData'],
    methods: {
      click1 () {
        console.log(1)
      },
      click2 () {
      },
      submit () {
        // 在这里可以拿到用户输入的值，通过v-model赋的值
        // 我在这里就直接取值了，这里的麻烦之处就在于可能需要遍历formData来取到对应的值
        // 可以使用数组的find方法 
        console.log(this.formData[0].val)
      }
    }
  }
</script>


<style>
</style>