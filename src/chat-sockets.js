import uuid from 'uuid/v4'
import moment from 'moment'
import casual from 'casual'

export const MSG_API__JOIN_CHANNEL = 'join channel'
export const MSG_API__LEAVE_CHANNEL = 'leave channel'
export const MSG_API__NEW_MESSAGE = 'new message'

const serverUser = {
  id: 99999,
  name: 'Server'
}

const wrapMessage = (msg, user) => ({
  user: user || serverUser,
  message: msg || casual.words(Math.random() * 100),
  id: uuid(),
  createdAt: moment()
})

exports = module.exports = (io) => {
  if (process.env.NODE_ENV === 'dev') {
    setInterval(() => {
      io.in('Nathejk').emit(MSG_API__NEW_MESSAGE, wrapMessage())
    }, 12000)
  }

  io.on('connection', (socket) => {
    socket.join('Nathejk')
    const query = socket.handshake.query

    socket.broadcast.emit('user connected', query)
    console.log(`${query} connected`)

    socket.on('chat mounted', (user) => {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id)
    })

    socket.on('leave channel', (channel) => {
      socket.leave(channel)
    })

    socket.on('join channel', (channel) => {
      socket.join(channel.name)
    })

    socket.on('new message', ({channel, message, user}) => {
      console.log({channel, message, user})
      // socket.broadcast.to(msg.channelID).emit('new message', msg)
      // socket.broadcast.to(msg.channelID).emit('new message', msg)
      io.in('Nathejk').emit(MSG_API__NEW_MESSAGE, wrapMessage(message, user))
    })

    socket.on('new channel', (channel) => {
      socket.broadcast.emit('new channel', channel)
    })

    socket.on('typing', (data) => {
      socket.broadcast.to(data.channel).emit('typing bc', data.user)
    })

    socket.on('stop typing', (data) => {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user)
    })

    socket.on('new private channel', (socketID, channel) => {
      socket.broadcast.to(socketID).emit('receive private channel', channel)
    })

    socket.on('disconnect', () => {
    // delete state[`${socket.id}`]
      console.log(`${socket.id} disconnected`)
    // socket.broadcast.emit('remove user', socket.id)
    })
  })
}
