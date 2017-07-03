#!/usr/bin/env node

const shapeshiftClient = require('../../shapeshift')

const shapeshift = new shapeshiftClient({timeout: 10000})

// public API methods

const pair = 'BTC_ETH'

var methods, i

const call_API = function(method, params){
  shapeshift.api(method, params)
  .then((result) => {
    console.log(`[Success] API method "${method}" returned the following response:`, "\n", JSON.stringify(result), "\n\n")
  })
  .catch((error) => {
    console.log(`[Error] API method "${method}" produced the following error message:`, "\n", error.message, "\n\n")
    if (error.code === 'JSON-PARSE') console.log('Server response:', "\n", error.api_response)
    if (error.code === 'ECONNRESET') console.log('Server timeout')
  })
}

methods = ['getcoins', 'recenttx']
for (i=0; i<methods.length; i++){
  call_API(methods[i])
}

methods = ['rate', 'limit', 'marketinfo']
for (i=0; i<methods.length; i++){
  call_API(methods[i], {pair})
}
