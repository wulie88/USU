const SerialPort = require('serialport')
const iconv = require('iconv-lite')

var pi = function (ds) {
  var s = []
  for (var i = 0; i < ds.length; i++) {
    let ch = ds[i].toString(16)
    s.push((ch.length === 1 ? '0' + ch : ch).toUpperCase())
  }

  return s.join(' ')
}

var Downlaoder = function () {
  this.port = null
}
Downlaoder.prototype.list = function (func) {
  SerialPort.list(function (err, ports) {
    let ps = []
    console.log(err)
    ports.forEach(function (port) {
      ps.push(port.comName)
      console.log(port.comName)
      console.log(port.pnpId)
      console.log(port.manufacturer)
    })
    func(ps)
  })
}
Downlaoder.prototype.connect = function (port) {
  this.port = new SerialPort(port, {
    baudrate: 38400,
    databits: 8,
    parity: 'none',
    parser: SerialPort.parsers.raw
  })

  // bind
  this.port.on('data', (data) => {
    console.log('[Downlaoder]received: ' + iconv.decode(data, 'GBK'))
    this.onReceiveOnce(iconv.decode(data, 'GBK'))
    setTimeout(() => {
      this.writeOnce()
    }, 2000)
  })

  this.port.on('open', () => {
    console.log('[Downlaoder]opened')
    this.writeOnce()
  })
}
Downlaoder.prototype.disconnect = function () {
  this.port.close()
  this.port = null
}
Downlaoder.prototype.write = function (portId, lines, onWriteOnce, onReceiveOnce) {
  if (this.port && this.portId !== portId) {
    this.disconnect()
  }

  this.portId = portId
  this.lines = lines
  this.onWriteOnce = onWriteOnce
  this.onReceiveOnce = onReceiveOnce

  setTimeout(() => {
    if (!this.port) {
      this.connect(portId)
    } else {
      this.writeOnce()
    }
  }, 1000)
}
Downlaoder.prototype.writeOnce = function () {
  let line = this.lines.shift()
  if (!line) {
    return
  }
  let buf = Buffer.from(line)
  console.log('[Downlaoder]sent:', buf)
  this.onWriteOnce(pi(line))
  this.port.write(buf)
}

let downloader = new Downlaoder()

export default downloader
