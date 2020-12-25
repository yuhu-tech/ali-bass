const mytoken = require('./mytoken')
const utils = require('../../utils/utils')

async function Issue() {
    var to = '0xc1437b3992fd172ca55a676e5d6e44593e48ba1784d6597561fdc3a7c9ba78bd'
    var value = 1000
    var res = await mytoken.MyToken.Issue(to, value)
    console.log(res)
}

async function Transfer() {
    var from = 'xiaobai'
    var publicKey = '65d0fa56db88078ce88a1f1670e74cb940f40fe0f26a47bacae3d22f863092c6c6a9f0dd8e46f601e4c10b340107f89748b6f51110deee4216f13e638e5bdb29'
    var privateKey = '526c900b4c65ff01bab2cce2710fdf1e32578afdc3358524a36256013db5287f'
    var to = '0x891c9892af0cc8a50c4198bafdbe79d15310aabf669c4826302700ca08ea1228'
    var value = 100
    var res = await mytoken.MyToken.Transfer(from, publicKey, privateKey, to, value)
    console.log(res)
}

async function NativeDepositData() {
    var data = {
        name: '老陆',
        age: 12
    }
    var dataStr = JSON.stringify(data)
    var hashData = await utils.Str2Hex(dataStr)
    var res = await mytoken.MyToken.NativeDepositData(hashData.hex)
    console.log(res)
}

async function QueryTotalSupply() {
    var res = await mytoken.MyToken.QueryTotalSuppy()
        console.log(res)
}

async function QueryBalanceOf(){
    var userId = '0xc1437b3992fd172ca55a676e5d6e44593e48ba1784d6597561fdc3a7c9ba78bd'
    var res = await mytoken.MyToken.QueryBalanceOf(userId)
    console.log(res)
}


Issue()
Transfer()
NativeDepositData()
QueryTotalSupply()
QueryBalanceOf()
