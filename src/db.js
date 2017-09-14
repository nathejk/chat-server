var mongojs = require('mongojs')
var dbHost = process.env.DB ? process.env.DB + '/nathejk' : 'nathejk'

console.log(process.env.DB)
var db = mongojs(dbHost, ['messages', 'users', 'events'])

exports.saveEvent = (event, channel, callback) => {
  db.events.insert(event, callback)
}

exports.saveUser = (user, channel, callback) => {
  db.users.insert(user, callback)
}

exports.saveMessage = (message, channel, callback) => {
  db.messages.insert(message, callback)
}

exports.getMessagesSince = function (channel, fromDate, callback) {
  db.messages.find({ createdAt: {'$gt': new Date(fromDate)} }, callback)
}

exports.createId = () => {
  return mongojs.ObjectId()
}
