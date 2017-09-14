import uuid from 'uuid/v4'
import casual from 'casual'

import db from './db'

export const MSG_API__CHANGE_CHANNEL = 'MSG_API__CHANGE_CHANNEL'
export const MSG_API__JOIN_CHANNEL = 'join channel'
export const MSG_API__LEAVE_CHANNEL = 'leave channel'
export const MSG_API__NEW_MESSAGE = 'new message'
export const MSG_API__NEW_MESSAGE_BULK = 'MSG_API__NEW_MESSAGE_BULK'
export const MSG_API__GET_MESSAGES_FROM = 'MSG_API__GET_MESSAGES_FROM'

const serverUser = {
  id: 99999,
  name: 'Server'
}

const wrapMessage = (msg, user, channel) => ({
  user: user || serverUser,
  message: msg || casual.words(Math.random() * 100),
  id: uuid(),
  channel: channel || 'nathejk',
  createdAt: new Date()
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

    socket.on(MSG_API__CHANGE_CHANNEL, (channel) => {
      socket.join(channel)
    })

    socket.on('new message', ({channel, message, user}) => {
      const wrappedMessage = wrapMessage(message, user, channel)
      db.saveMessage(wrappedMessage)
      io.in('Nathejk').emit(MSG_API__NEW_MESSAGE, wrappedMessage)
    })

    socket.on('new channel', (channel) => {
      socket.broadcast.emit('new channel', channel)
    })

    socket.on(MSG_API__GET_MESSAGES_FROM, ({channel, fromDate}) => {
      db.getMessagesSince(channel, fromDate, (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        if (!data || data.length === 0) {
          return
        }

        socket.emit(MSG_API__NEW_MESSAGE_BULK, data)
      })
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
