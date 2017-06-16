// -----------------------------------------------
// Node.js wrapper for the ShapeShift.io API
// -----------------------------------------------
// docs:
// https://info.shapeshift.io/api
// -----------------------------------------------

const https = require('https')
const url = require('url')

const api_base_url = 'https://shapeshift.io'

function ShapeShift(opt){
  if (! this instanceof ShapeShift){
    return new ShapeShift(opt)
  }
  var self = this

  var config = Object.assign({},
  {
    // default user-configurable options
    agent: false,
    timeout: 5000
  },
  (opt || {}))

  var send_POST_request, send_GET_request, api

  send_POST_request = function(command='', params={}){
    return new Promise((resolve, reject) => {
      var POST_url, POST_data, options

      try {
        if (! command) throw new Error('missing: API method')

        POST_url  = `${api_base_url}/${command}`
        POST_data = JSON.stringify(params)

        options = Object.assign({}, url.parse(POST_url), {
          method: 'POST',
          headers: {
            "Content-Length": Buffer.byteLength(POST_data, 'utf8'),
            "User-Agent": `Mozilla/4.0 (compatible; ShapeShift Node.js bot; ${process.platform}; Node.js/${process.version})`
          },
          agent: config.agent,
          timeout: config.timeout
        })

        const req = https.request(options, (res) => {
          var data = ''

          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            data += chunk
          });
          res.on('end', () => {
            data = JSON.parse(data)
            if (data && data.error){
              reject(new Error(data.error))
            }
            else {
              resolve(data)
            }
          });
        })

        req.on('error', (error) => {
          reject(error)
        })

        req.write(POST_data)
        req.end()
      }
      catch(error){
        reject(error)
      }
    })
  }

  send_GET_request = function(command='', params={}){
    return new Promise((resolve, reject) => {
      var GET_url, options

      try {
        switch(command){
          case 'rate':
          case 'limit':
            if (! params.pair) throw new Error('missing parameter: "pair"')
            GET_url = `${api_base_url}/${command}/${params.pair}`
            break
          case 'marketinfo':
            if (! params.pair) params.pair = ''
            GET_url = `${api_base_url}/${command}/${params.pair}`
            break
          case 'recenttx':
            if (! params.max) params.max = ''
            GET_url = `${api_base_url}/${command}/${params.max}`
            break
          case 'txStat':
          case 'timeremaining':
            if (! params.address) throw new Error('missing parameter: "address"')
            GET_url = `${api_base_url}/${command}/${params.address}`
            break
          case 'getcoins':
            GET_url = `${api_base_url}/${command}`
            break
          case 'txbyapikey':
            if (! params.apiKey) throw new Error('missing parameter: "apiKey"')
            GET_url = `${api_base_url}/${command}/${params.apiKey}`
            break
          case 'txbyaddress':
            if (! params.address) throw new Error('missing parameter: "address"')
            if (! params.apiKey)  throw new Error('missing parameter: "apiKey"')
            GET_url = `${api_base_url}/${command}/${params.address}/${params.apiKey}`
            break
          case 'validateAddress':
            if (! params.address)    throw new Error('missing parameter: "address"')
            if (! params.coinSymbol) throw new Error('missing parameter: "coinSymbol"')
            GET_url = `${api_base_url}/${command}/${params.address}/${params.coinSymbol}`
            break
          case '':
            throw new Error('missing: API method')
          default:
            throw new Error(command + ' is not a valid API method.')
        }

        options = Object.assign({}, url.parse(GET_url), {
          method: 'GET',
          headers: {
            "User-Agent": `Mozilla/4.0 (compatible; ShapeShift Node.js bot; ${process.platform}; Node.js/${process.version})`
          },
          agent: config.agent,
          timeout: config.timeout
        })

        const req = https.request(options, (res) => {
          var data = ''

          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            data += chunk
          });
          res.on('end', () => {
            data = JSON.parse(data)
            if (data && data.error){
              reject(new Error(data.error))
            }
            else {
              resolve(data)
            }
          });
        })

        req.on('error', (error) => {
          reject(error)
        })

        req.end()
      }
      catch(error){
        reject(error)
      }
    })
  }

  api = function(method, params){
    var methods = {
      get:  ['rate', 'limit', 'marketinfo', 'recenttx', 'txStat', 'timeremaining', 'getcoins', 'txbyapikey', 'txbyaddress', 'validateAddress'],
      post: ['shift', 'mail', 'sendamount', 'cancelpending']
    }
    if(methods.get.indexOf(method) !== -1) {
      params = params || {}
      return send_GET_request(method, params)
    }
    else if(methods.post.indexOf(method) !== -1) {
      params = params || {}
      return send_POST_request(method, params)
    }
    else {
      return Promise.reject(new Error(method + ' is not a valid API method.'))
    }
  }

  self.api = api
}

module.exports = ShapeShift
