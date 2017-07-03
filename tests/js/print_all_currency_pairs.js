#!/usr/bin/env node

const shapeshiftClient = require('../../shapeshift')

const shapeshift = new shapeshiftClient({timeout: 10000})

shapeshift.api('marketinfo', {})
.then((result) => {
  let pairs = result.map(element => element.pair)
  console.log('[Success] response for API method "marketinfo" included the following list of currency pairs:', "\n", JSON.stringify(pairs), "\n\n")
})
.catch((error) => {
  console.log(`[Error] API method "${method}" produced the following error message:`, "\n", error.message)
  if (error.code === 'JSON-PARSE') console.log('Server response:', "\n", error.api_response)
  if (error.code === 'ECONNRESET') console.log('Server timeout')
  console.log("\n")
})
