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
  this.index = CObject.Index++
  this.mixedKey = mixedKey
  this.dataType = dataType
  this.belongTo = belongTo
  this.deviceType = deviceType
  CObject.All.push(this)
}
CObject.Index = 5

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
}
CObject.prototype.dump = function () {
  return [this.index, this.byte, this.type]
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
  this.configs = {}
}
Manager.prototype.update = function (name, obj) {
  this.configs[name] = obj
}
var manager = new Manager()

export default {
  Addr0,
  Addr1,
  Frame,
  Fragment,
  CObject,
  manager,
  pi,
  merge
}
