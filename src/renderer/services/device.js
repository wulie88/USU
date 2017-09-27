let Addr0 = 0x11
let Addr1 = 0x0D

// example
/*
N1=H,AA 04 A1 11 0D 9D 63
N2=H,AA 0D A3 11 0D 00 10 05 02 01 14 07 02 01 4A 1A
N3=H,AA 13 A3 11 0D 00 1F 0B 01 00 00 03 02 00 01 07 00 05 57 00 18 9B
N4=H,AA 18 A3 11 0D 00 42 10 02 00 00 02 02 00 05 00 00 05 02 06 57 00 07 47 03 63 35
N5=H,AA 15 A3 11 0D 00 65 0D 03 00 00 00 00 05 03 02 08 57 00 09 47 00 05 4B
N6=H,AA 1D A3 11 0D 00 88 15 04 00 00 02 00 00 00 00 00 00 00 00 00 00 02 02 0A 47 07 FF 00 FF 33 6D
N7=H,AA 19 A3 11 0D 00 AB 11 07 02 02 00 00 00 00 00 00 0B 57 00 0C 57 00 0D 57 00 62 27
N8=H,AA 1D A3 11 0D 00 C0 15 00 01 01 00 02 00 00 02 01 02 00 03 04 00 00 04 01 01 02 01 03 01 12 91
N9=H,AA 1B A3 11 0D 01 5F 13 01 05 02 06 03 07 04 08 05 09 08 0A 09 0B 0A 0C 06 0D 07 06 29 0D
N10=H,AA 04 5A 11 0D EC 92
*/

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
Frame.CM_SetReboot = 0x5a
Frame.SetConfig = function (comment, data) {
  return new Frame(comment, Frame.CM_SetConfig, [Addr0, Addr1].concat(data))
}
Frame.SetAddr = function (comment) {
  return new Frame(comment, Frame.CM_SetAddr, [Addr0, Addr1])
}
Frame.SetReboot = function (comment) {
  return new Frame(comment, Frame.CM_SetReboot, [Addr0, Addr1])
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
var FrameReboot = function () {
  this.name = 'reboot'
}
FrameReboot.prototype.dump = function () {
  let f1 = Frame.SetReboot(this.name)
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

/**
 * 通讯对象
 *
 * mixedKey: 通讯对象配置字
 * dataType: 通讯对象数据类型
 * belongTo: 属于哪个配置, 如: 通道A 通道B 通道C 通道D 组合按键
 * comment: 设备备注, 如: 开关、开光/调光、窗帘
 */
var CObject = function (mixedKey, dataType, belongTo, comment) {
  this.id = CObject.Id++
  this.mixedKey = mixedKey
  this.dataType = dataType
  this.belongTo = belongTo
  this.comment = comment
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
CObject.BelongToCombine = 4

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
  let ds = [addr[2], addr[0] << 3 | addr[1]]
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
    let ch = ds[i].toString(16)
    s.push((ch.length === 1 ? '0' + ch : ch).toUpperCase())
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
Manager.Names = ['addr', 'reboot', 'general', 'channelA', 'channelB', 'channelC', 'channelD', 'combine', 'group', 'group2objs']
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
  this.update('reboot', new FrameReboot())
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
