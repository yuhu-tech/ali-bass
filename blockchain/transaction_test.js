const transaction = require('./transaction')
const utils = require('../utils/utils')

async function QueryTransaction(){
    var txhash = '0x9803354c50bdb10fb0c12792fa7c1f71a11aeb458c8289a18260d673f77b0eb9'
    var hashData = await transaction.QueryTransaction(txhash)
    console.log(hashData)
    var res = await utils.Hex2Str(hashData.originData)
    var data = JSON.parse(res.str)
    console.log(data)
}

QueryTransaction()