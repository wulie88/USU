let Addr0 = 0x11
let Addr1 = 0x0D

var Frame = function (comment, command, data) {
  this.comment = comment
  // all data [0xaa, length, 0xa1, d, d, ch, cl]
  var d = [0xaa, data.length + 2, command].concat(data)
  var c = crc16(d.slice(1))
  return d.concat([c >> 8, c & 0xFF])
}
Frame.Index = 0
Frame.CM_SetAddr = 0xa1
Frame.CM_SetConfig = 0xa3
Frame.SetConfig = function (comment, data) {
  return new Frame(comment, Frame.CM_SetConfig, [Addr0, Addr1].concat(data))
}
Frame.SetAddr = function (comment) {
  return new Frame(comment, Frame.CM_SetAddr, [Addr0, Addr1])
}

var FrameConfig = function (name, originalData, objs) {
  let name2code = {'general': 16, 'channelA': 31, 'channelB': 66, 'channelC': 101, 'channelD': 136, 'combine': 171, 'group': 192, 'group2objs': 351}
  this.name = name
  this.od = originalData
  this.objs = objs || []
  this.start = name2code[this.name]
}
FrameConfig.prototype.dump = function () {
  let that = this
  let ff = new Fragment(this.name, this.start, (f) => {
    f.batch(that.od)
    that.objs.forEach(function (obj) {
      console.log('obj.dump()', obj.dump())
      f.batch(obj.dump())
    })
  })
  let f1 = Frame.SetConfig(ff.title, ff.dump())
  console.log(this.name, pi(f1))
  return pi(f1)
}
var FrameAddr = function () {
  this.name = 'addr'
}
FrameAddr.prototype.dump = function () {
  let f1 = Frame.SetAddr(this.name)
  console.log(this.name, pi(f1))
  return pi(f1)
}

var Fragment = function (comment, base, func) {
  this.title = comment
  this.base = base
  this.configs = []
  this.init(func)
}
Fragment.prototype.init = function (func) {
  func(this)
}
Fragment.prototype.batch = function (configs) {
  var self = this
  configs.forEach(function (config) {
    self.configs.push(['-', config])
  })
}
Fragment.prototype.add = function (comment, config) {
  this.configs.push([comment, config])
}
Fragment.prototype.dump = function () {
  // baseHi, baseLo, length-2, d0, d1, d2
  var data = [this.base >> 8, this.base & 0xFF, this.configs.length - 1]
  for (var i = 0; i < this.configs.length; i++) {
    data.push(this.configs[i][1] + 0)
  }
  return data
}

var CObject = function (mixedKey, dataType, belongTo, deviceType) {
  this.id = CObject.Id++
  this.mixedKey = mixedKey
  this.dataType = dataType
  this.belongTo = belongTo
  this.deviceType = deviceType
  CObject.All.push(this)
}
CObject.Id = 5

// DataType
CObject.UINT1 = 0
CObject.UINT2 = 1
CObject.UINT3 = 2
CObject.UINT4 = 3
CObject.UINT5 = 4
CObject.UINT6 = 5
CObject.UINT7 = 6
CObject.UINT8 = 7
CObject.UINT16 = 8
CObject.BYTE3 = 9
CObject.FLOAT = 10
CObject.DATA6 = 11
CObject.DOUBLE = 12
CObject.DATA10 = 13
CObject.MAXDATA = 14
CObject.VARDATA = 15

// MixedKey
CObject.CWT = 0x57
CObject.CT = 0x47

// Belong To
CObject.BelongToA = 0
CObject.BelongToB = 1
CObject.BelongToC = 2
CObject.BelongToD = 3

// CObject Management
CObject.All = []
CObject.Clean = function () {
  CObject.All = []
  CObject.Id = 5
}
CObject.FindObjById = function (id) {
  let found = null
  CObject.All.forEach(function (e) {
    if (e.id === id) {
      found = e
    }
  })

  return found
}
CObject.prototype.groups = function () {
  let results = []
  CGroup.FindGroupByObjId(CGroup.Root, this.id, results)
  return results
}
CObject.prototype.groupAddrs = function () {
  let groups = this.groups()
  console.log('groups', groups, this.id)
  let addrs = []
  groups.forEach(function (g) {
    addrs.push(g.addr())
  })
  return addrs.join(', ')
}
CObject.prototype.dump = function () {
  return [this.index, this.mixedKey, this.dataType]
}

var CGroup = function (parentId, name, value) {
  let parent = CGroup.FindGroupById(CGroup.Root, parentId)
  this.parentId = parentId
  this.id = CGroup.Id
  this.name = name
  this.subs = []
  this.level = 0
  this.value = value || 0
  this.includes = []
  if (parent) {
    this.level = parent.level + 1
    this.parent = parent
    parent.addSub(this)
  }
  CGroup.Id++
}
CGroup.Id = 0
CGroup.Root = null
CGroup.Clean = function () {
  CGroup.Id = 0
  CGroup.Root = null
  CGroup.Root = new CGroup(-1, 'Root')
}
CGroup.Dump = function () {
  let groups = []
  CGroup.DumpItem(CGroup.Root, groups)
  return groups
}
CGroup.DumpItem = function (root, groups) {
  for (var i = 0; i < root.subs.length; i++) {
    let group = root.subs[i]
    groups.push(group)
    CGroup.DumpItem(group, groups)
  }
}
CGroup.RemoveGroupById = function (id) {
  var g = CGroup.FindGroupById(CGroup.Root, id)
  g.parent.subs = g.parent.subs.filter(item => item !== g)
}
CGroup.FindGroupById = function (root, id) {
  if (!root) {
    return null
  }
  console.log('FindGroupById', root.id, id)

  // self
  if (root.id === id) {
    return root
  }

  // subs
  let subs = root.subs
  for (var i = 0; i < root.subs.length; i++) {
    let group = subs[i]
    let r = CGroup.FindGroupById(group, id)
    if (r) {
      return r
    }
  }
}
CGroup.FindGroupByObjId = function (root, objId, results) {
  if (!root) {
    return
  }

  // self
  if (root.includes.indexOf(objId) !== -1) {
    results.push(root)
  }

  // subs
  let subs = root.subs
  for (var i = 0; i < root.subs.length; i++) {
    let group = subs[i]
    CGroup.FindGroupByObjId(group, objId, results)
  }
}
CGroup.prototype.addr = function (sub) {
  let addr = []
  var parent = this
  while (parent) {
    addr.unshift(parent.value)
    parent = parent.parent
  }
  return addr.slice(1).join('.')
}
CGroup.prototype.codeAddr = function (sub) {
  let addr = []
  var parent = this
  while (parent) {
    addr.unshift(parseInt(parent.value))
    parent = parent.parent
  }
  addr = addr.slice(1)
  let ds = [addr[0] << 3 | addr[1], addr[2]]
  console.log('codeAddr', addr, ds)
  return ds
}
CGroup.prototype.addSub = function (sub) {
  this.subs.push(sub)
}
CGroup.prototype.addObj = function (id) {
  if (this.includes.indexOf(id) !== -1) {
    return
  }
  this.includes.push(id)
}
CGroup.prototype.removeObj = function (id) {
  this.includes = this.includes.filter(item => item !== id)
}
CGroup.prototype.includeObjs = function () {
  let objs = []
  this.includes.forEach(function (e) {
    let obj = CObject.FindObjById(e)
    objs.push(obj)
  })

  return objs
}

function crc16 (bytes) {
  var bytesLength = bytes.length
  var CRC16Lo, CRC16Hi
  var CL, CH
  var SaveHi, SaveLo
  var i, j, result

  CRC16Lo = 0xFF
  CRC16Hi = 0xFF
  CL = 0x01
  CH = 0xA0
  for (i = 0; i < bytesLength; i++) {
    CRC16Lo = CRC16Lo ^ bytes[i]
    for (j = 0; j <= 7; j++) {
      SaveHi = CRC16Hi
      SaveLo = CRC16Lo
      CRC16Hi = CRC16Hi >> 1
      CRC16Lo = CRC16Lo >> 1
      if (SaveHi & 0x01) {
        CRC16Lo = CRC16Lo | 0x80
      }
      if (SaveLo & 0x01) {
        CRC16Hi = CRC16Hi ^ CH
        CRC16Lo = CRC16Lo ^ CL
      }
    }
  }

  // console.log(bytes, 'Lo:', CRC16Lo, 'Hi:', CRC16Hi)
  result = ((0x0000 | CRC16Lo) << 8) + CRC16Hi
  return result
}

var pi = function (ds) {
  var s = []
  for (var i = 0; i < ds.length; i++) {
    s.push(ds[i].toString(16))
  }

  return s.join(' ')
}

var merge = function (ds, length) {
  var s = []
  for (var i = 0; i < length; i++) {
    let d = ds['r' + i]
    s.push(typeof d === 'boolean' ? d + 0 : parseInt(d))
  }

  return s
}

var Manager = function () {
  this.reset()
}
Manager.Names = ['addr', 'general', 'channelA', 'channelB', 'channelC', 'channelD', 'combine', 'group', 'group2objs']
Manager.prototype.reset = function () {
  this.configs = [] // JSON.parse(window.localStorage.getItem('configs')) || {}
}
Manager.prototype.update = function (name, obj) {
  this.configs[name] = obj
  // window.localStorage.setItem('configs', JSON.stringify(this.configs))
}
Manager.prototype.configedCount = function () {
  console.log('Object.keys(this.configs)', Object.keys(this.configs))
  return Object.keys(this.configs).length
}
Manager.prototype.allCObjects = function () {
  var that = this
  let s = 5
  let objs = []
  Manager.Names.forEach(function (name) {
    let cfg = that.configs[name]
    if (!cfg) {
      return
    }
    cfg.objs.forEach(function (obj) {
      obj.index = s++
      objs.push(obj)
    })
  })
  console.log('allCObjects', objs)
  return objs
}
Manager.prototype.setAddr = function (addr0, addr1) {
  Addr0 = addr0
  Addr1 = addr1
  this.update('addr', new FrameAddr())
}
Manager.prototype.dump = function () {
  var that = this
  let cfgs = []
  Manager.Names.forEach(function (name) {
    let cfg = that.configs[name]
    if (!cfg) {
      return
    }
    cfgs.push(cfg)
  })
  return cfgs
}
var manager = new Manager()

export default {
  Addr0,
  Addr1,
  Frame,
  FrameConfig,
  Fragment,
  CObject,
  CGroup,
  manager,
  pi,
  merge
}
