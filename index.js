#!/usr/bin/env babel-node

// @flow
require('opbeat').start({
  appId: '230f25efa8',
  organizationId: '5e39308c355149cb9fc5280d31ede681',
  secretToken: process.env.NODE_ENV === 'production' ? '408ab3b63915571f7ad03d8e7726a0d90a29cc63' : ''
})

require('babel-register')({
  ignore: /node_modules\/(?!nathejk-chat)/
})

require('./src/chat-server').default()
