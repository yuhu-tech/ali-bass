const query = require('./query')
const utils = require('../../utils/utils')

async function QueryTotalSupply() {
    var res = await query.QueryTotalSuppy()
        console.log(res)
}

async function QueryBalanceOf(){
    var userId = '0xc1437b3992fd172ca55a676e5d6e44593e48ba1784d6597561fdc3a7c9ba78bd'
    var res = await query.QueryBalanceOf(userId)
    console.log(res)
}

async function QueryAccount(){
    var userId = 'xiaobai'
    var res = await query.QueryAccount(userId)
    console.log(res)
}

async function QueryTransaction(){
    var txhash = '0x9803354c50bdb10fb0c12792fa7c1f71a11aeb458c8289a18260d673f77b0eb9'
    var hashData = await query.QueryTransaction(txhash)
    console.log(hashData)
    var res = await utils.Hex2Str(hashData.originData)
    var data = JSON.parse(res.str)
    console.log(data)
}

//QueryTotalSupply()
//QueryBalanceOf()
//QueryAccount()
QueryTransaction()