const SerialPort = require('serialport')
const iconv = require('iconv-lite')
const Readline = SerialPort.parsers.Readline

var Downlaoder = function () {
  this.port = null
}
Downlaoder.prototype.connect = function (port) {
  let that = this
  this.port = new SerialPort(port, {
    baudRate: 38400,
    databits: 8,
    parity: 'none'
  })

  const parser = new Readline()
  this.port.pipe(parser)
  parser.on('data', (data) => {
    console.log('[Downlaoder]received: ' + iconv.decode(data, 'GBK'))
    that.writeOnce()
  })
}
Downlaoder.prototype.write = function (port, lines, onWroteOnce, onReceivedOnce) {
  this.lines = lines
  if (!this.port) {
    this.connect(port)
  }

  this.writeOnce()
}
Downlaoder.prototype.writeOnce = function () {
  let line = this.lines.shift()
  console.log('[Downlaoder]sent:', line)
  this.port.write(line)
}

let downloader = new Downlaoder()
downloader.write('COM3', [[1, 2]])

// export default downloader
