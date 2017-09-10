<template>
<div id="grouping" class="window">
	<section class="objs">
	  <div class="table">
		<header class="table-header">
			<span class="t0">Index</span>
			<span class="t1">Channel</span>
			<span class="t2">Type</span>
			<span class="t3">Group Addr</span>
      <span class="t0">操作</span>
		</header>
		<section class="table-body">
			<ul>
				<li v-for="obj in objs">
					<span class="t0">{{obj.id}}</span>
					<span class="t1">{{obj.belongTo | channel}}</span>
					<span class="t2">{{obj.deviceType | stringDeviceType}}</span>
					<span class="t3">{{obj | groupAddrs}}</span>
          <span class="t0"><i @click="addObjToGroup(obj.id)" class="icon icon-plus-circled"></i></span>
				</li>
			</ul>
		</section>
	  </div>
	</section>
	<section class="groups">
   <aside>
     <p><i @click="addGroup(0)"class="icon icon-plus-circled"></i> 群组</p>
     <ul>
        <template v-for="group in groups">
         <li :class="{active: activedId === group.id}" @click="activeGroup(group.id)">
          <div class="r"><i @click="addGroup(group.id)" v-if="group.level<3" class="icon icon-plus-circled"></i> <i @click="delGroup(group.id)" class="icon icon-cancel-circled"></i></div>
          <template v-for="i in group.level">
            <span class="indent"></span>
          </template>
          <span class="icon icon-doc-text"></span> {{group.value}} {{group.name}}
         </li>
        </template>
     </ul>
   </aside> 
   <div class="groups2objs">
    <div class="table">
    <header class="table-header">
      <span class="t0">Index</span>
      <span class="t1">Channel</span>
      <span class="t2">Type</span>
      <span class="t0">操作</span>
    </header>
    <section class="table-body">
      <ul>
        <li v-for="obj in activedGroupIncludes">
          <span class="t0">{{obj.id}}</span>
          <span class="t1">{{obj.belongTo | channel}}</span>
          <span class="t2">{{obj.deviceType | stringDeviceType}}</span>
          <span class="t0"><i @click="removeObjFromGroup(obj.id)" class="icon icon-cancel-circled"></i></span>
        </li>
      </ul>
    </section>
    </div>
   </div>
  </section>
  <group-model :parentGroup="activedGroup" @submitGroupModel="receivedSubmitFromClild" @cancelGroupModel="receivedCancelFromClild" v-if="showModel"></group-model>

  <footer class="toolbar toolbar-footer">
    <div class="toolbar-actions">
      <button @click="prev" class="btn btn-default">
        上一步
      </button>

      <button @click="save" class="btn btn-primary pull-right">
        写入
      </button>
    </div>
  </footer>
</div>
</template>

<script>
  import Device from '@/services/device'
  import GroupModel from './GroupingPage/GroupModel'
  export default {
    components: { GroupModel },
    data () {
      return {
        showModel: false,
        parentId: 0,
        activedId: 0,
        activedGroup: null,
        objs: Device.CObject.All,
        groups: [],
        activedGroupIncludes: []
      }
    },
    mounted () {
      Device.CGroup.Clean()
      new Device.CGroup(0, '主群租', 0)
      new Device.CGroup(1, '中间组', 0)
      new Device.CGroup(2, '子群组', 0)
      this.groups = Device.CGroup.Dump()
      console.log('mounted', this.groups)
      this.activeGroup(0)
    },
    methods: {
      prev () {
        this.$router.replace('/')
      },
      save () {
        // group
        let groups = []
        let index = 0
        this.groups.forEach(function (g) {
          if (g.level !== 3) {
            return
          }
          g.index = index
          index++
          groups.push(g)
        })
        console.log('reset index', groups)
        let ds = []
        groups.forEach(function (g) {
          ds = ds.concat(g.codeAddr())
        })
        this.receivedFromClild(new Device.FrameConfig('group', ds))
        // group 2 obj
        let group2objs = []
        Device.manager.allCObjects().forEach(function (obj) {
          console.log('obj', obj, obj.groups())
          obj.groups().forEach(function (g) {
            group2objs = group2objs.concat([g.index, obj.id])
          })
        })
        console.log('group2objs', group2objs)
        this.receivedFromClild(new Device.FrameConfig('group2objs', group2objs))
        // next
        this.$router.replace('/result')
      },
      addGroup: function (parentId) {
        this.parentId = parentId
        this.showModel = true
      },
      delGroup: function (id) {
        Device.CGroup.RemoveGroupById(id)
        // force reload
        this.reload()
      },
      activeGroup: function (id) {
        this.activedId = id
        this.activedGroup = Device.CGroup.FindGroupById(Device.CGroup.Root, id)
        this.activedGroupIncludes = this.activedGroup ? this.activedGroup.includeObjs() : []
      },
      addObjToGroup: function (objId) {
        if (this.activedGroup.level === 3) {
          this.activedGroup.addObj(objId)
          this.reload()
        }
      },
      removeObjFromGroup: function (objId) {
        this.activedGroup.removeObj(objId)
        this.reload()
      },
      reload: function () {
        this.activedId = 0
        this.groups = Device.CGroup.Dump()
        this.activeGroup(this.activedId)
      },
      receivedSubmitFromClild: function (msg) {
        this.receivedCancelFromClild()
        new Device.CGroup(this.parentId, msg.name, msg.addr)
        this.groups = Device.CGroup.Dump()
        // force reload
        this.activedId = 0
        this.reload()
        console.log(Device.CGroup.Root)
      },
      receivedFromClild (msg) {
        Device.manager.update(msg.name, msg)
        console.log('receivedFromClild', msg)
        msg.dump()
      },
      receivedCancelFromClild: function () {
        this.showModel = false
      }
    },
    filters: {
      channel: function (index) {
        return ['channelA', 'channelB', 'channelC', 'channelD'][index]
      },
      stringDeviceType: function (index) {
        return ['-', '开关', '开关/调光'][index]
      },
      groupAddrs: function (obj) {
        console.log('filters:groupAddrs', obj.groupAddrs())
        return obj.groupAddrs()
      }
    }
  }
</script>

<style>

  * {
    margin: 0;
    padding: 0;
  }
  #grouping { width: 100%; height: 100%; }
  #grouping .toolbar-actions { padding-bottom: 6px; }
  .objs {height: 60%; width: 100%; box-sizing: border-box; background: #fff; border-bottom: 1px solid #ddd;}
  .groups {height: 40%; width: 100%;}
  .table { overflow-y: auto; height: 100%; }
  .table span { display: inline-block; padding: 4px 10px; border-right: 1px solid #ddd; }
  .table-header { font-size: 14px; line-height: 2.2; border-bottom: 1px solid #ddd;}
  .table-body li {border-bottom: 1px solid #ddd;}
  .t0 { width: 80px; }
  .t1 { width: 100px; }
  .t2 { width: 100px; }
  .t3 { width: 300px; }
  .groups {display: flex;}
  .groups aside { width: 40%; height: 100%; box-sizing: border-box; border-right: 1px solid #ddd; padding: 10px; background: #f5f5f4; overflow-y: auto; }
  .groups .groups2objs { flex: 1; box-sizing: border-box; overflow-y: auto; }
  .groups2objs li {}
  aside p i { float: right; }
  aside li {padding: 5px 1em; line-height: 2;}
  aside .r { float: right; }
  aside .active { background: #dcdfe1; }
  aside .indent { display: inline-block; width: 1em; height: 100%; }
</style>