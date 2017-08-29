<template>
  <div class="window">
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
              <button type="submit" class="btn btn-form btn-primary">下一步</button>
            </div>
          </nav>
        </div>
        <div class="pane">
          <div v-show="activeIndex == 0">
            <general-form @listenToChild="receivedFromClild" name="general"></general-form>
          </div>
          <div v-show="activeIndex == 1">
            <channel-form @listenToChild="receivedFromClild" name="channelA"></channel-form>
          </div>
          <div v-show="activeIndex == 2">
            <channel-form @listenToChild="receivedFromClild" name="channelA"></channel-form>
          </div>
          <div v-show="activeIndex == 3">
            <channel-form @listenToChild="receivedFromClild" name="channelA"></channel-form>
          </div>
          <div v-show="activeIndex == 4">
            <channel-form @listenToChild="receivedFromClild" name="channelA"></channel-form>
          </div>
          <div v-show="activeIndex == 5">
            <combine-form @listenToChild="receivedFromClild" name="combine"></combine-form>
          </div>
        </div>
      </div>
    </div>
    <footer class="toolbar toolbar-footer">
      <h1 class="title">Footer</h1>
    </footer>
  </div>
</template>

<script>
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
        settings: {},
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
      console.log(this.$refs)
    },
    methods: {
      tab (index) {
        this.activeIndex = index
        // this.currentView = this.items[index].content
      },
      receivedFromClild (msg) {
        this.settings[this.activeIndex] = msg
        console.log('receivedFromClild', msg)
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
.nav-steps { padding: 15px 30px; }
</style>