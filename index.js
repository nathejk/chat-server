#!/usr/bin/env babel-node

// @flow

require('babel-register')({
  ignore: /node_modules\/(?!nathejk-chat)/
})

require('./src/chat-server').default()
