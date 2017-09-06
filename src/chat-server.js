import path from 'path'
import socketDefinition from './chat-sockets'

export default () => {
}

var app = require('http').createServer(handler)
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(process.env.PORT || 3002)

function handler (req, res) {
  fs.readFile(path.join(__dirname, '/index.html'),
    function (err, data) {
      if (err) {
        res.writeHead(500)
        return res.end('Error loading index.html')
      }

      res.writeHead(200)
      res.end(data)
    })
}

socketDefinition(io)
