### [Node.js ShapeShift API](https://github.com/warren-bank/node-shapeshift-api)

Node.js Client Library for the ShapeShift (shapeshift.io) API

This is an asynchronous Promise-based Node.js client for the shapeshift.io API.

#### Installation:

```bash
npm install --save @warren-bank/node-shapeshift-api
```

#### Usage:

* class constructor:
  * input: `config` (optional: `{agent, timeout}`)
* `api()` method:
  * input: `method` (required), `params` (varies by method)<br>
    where: `method` is one of the following values (as specified in the [official API docs](https://info.shapeshift.io/api) ):
    * 'rate', `{pair}`
    * 'limit', `{pair}`
    * 'marketinfo', `{pair}`
    * 'recenttx', `{max}`
    * 'txStat', `{address}`
    * 'timeremaining', `{address}`
    * 'getcoins', `{}`
    * 'txbyapikey', `{apiKey}`  // PRIVATE api key
    * 'txbyaddress', `{address, apiKey}`  // PRIVATE api key
    * 'validateAddress', `{address, coinSymbol}`
    * 'shift', `{withdrawal, pair, returnAddress, destTag, rsAddress, apiKey}`  // PUBLIC api key
    * 'mail', `{email, txid}`
    * 'sendamount', `{amount, withdrawal, pair, returnAddress, destTag, rsAddress, apiKey}`  // PUBLIC api key
    * 'cancelpending', `{address}`
  * output: Promise

#### Example:

```javascript
const shapeshiftClient = require('@warren-bank/node-shapeshift-api')
const shapeshift = new shapeshiftClient({timeout: 10000})

// get current rate for currency pair
shapeshift.api('rate', {pair: 'BTC_ETH'})
.then((result) => {
  console.log(`pair: ${result.pair}`)
  console.log(`rate: ${result.rate}`)
})
.catch((error) => {
  console.log('Error:', error.message)
})
```

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
