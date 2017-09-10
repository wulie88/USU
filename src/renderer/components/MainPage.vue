<template>
<div id="mainPage" class="window">
  <div class="window-content">
  <div class="pane-group">
    <div class="pane-sm sidebar">
      <nav class="nav-group">
        <h5 class="nav-group-title">配置</h5>
        <a v-for="(item, index) in items" @click="tab(index)" class="nav-group-item" :class="{active: activeIndex === index} ">
          <span class="icon" :class="item.icon"></span>
          {{item.title}}
        </a>
        <div class="nav-steps">
          <p>进度: {{ configedCount }}/6</p>
          <button @click="next" type="button" class="btn btn-form btn-disable" :class="{'btn-primary': configedCount >= 6}">下一步</button>
        </div>
      </nav>
    </div>

    <div class="pane">
      <div v-show="activeIndex == 0">
        <general-form @submitFrameConfig="receivedFromClild" name="general"></general-form>
      </div>
      <div v-show="activeIndex == 1">
        <channel-form @submitFrameConfig="receivedFromClild" name="channelA"></channel-form>
      </div>
      <div v-show="activeIndex == 2">
        <channel-form @submitFrameConfig="receivedFromClild" name="channelB"></channel-form>
      </div>
      <div v-show="activeIndex == 3">
        <channel-form @submitFrameConfig="receivedFromClild" name="channelC"></channel-form>
      </div>
      <div v-show="activeIndex == 4">
        <channel-form @submitFrameConfig="receivedFromClild" name="channelD"></channel-form>
      </div>
      <div v-show="activeIndex == 5">
        <combine-form @submitFrameConfig="receivedFromClild" name="combine"></combine-form>
      </div>
    </div>

  </div>
  </div>
</div>
</template>

<script>
  import Device from '@/services/device'
  import SystemInformation from './LandingPage/SystemInformation'
  import GeneralForm from './MainPage/GeneralForm'
  import CombineForm from './MainPage/CombineForm'
  import ChannelForm from './MainPage/ChannelForm'

  export default {
    name: 'main-page',
    components: { SystemInformation, GeneralForm, CombineForm, ChannelForm },
    data () {
      return {
        activeIndex: 0,
        configedCount: 0,
        items: [
          {title: '通用', icon: 'icon-publish'},
          {title: '通道A', icon: 'icon-window'},
          {title: '通道B', icon: 'icon-window'},
          {title: '通道C', icon: 'icon-window'},
          {title: '通道D', icon: 'icon-window'},
          {title: '组合按键', icon: 'icon-window'}
        ]
      }
    },
    mounted () {
      Device.CObject.Clean()
    },
    methods: {
      tab (index) {
        this.activeIndex = index
      },
      receivedFromClild (msg) {
        Device.manager.update(msg.name, msg)
        this.configedCount = Device.manager.configedCount()
        console.log('receivedFromClild', msg)
        msg.dump()
      },
      next () {
        if (this.configedCount >= 6) {
          this.$router.push('/grouping')
        }
      }
    }
  }
</script>

<style>
.nav-steps { padding: 15px 30px; }
.nav-steps p { text-align: center; }
</style>