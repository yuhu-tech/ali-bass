const account = require('./account')
const conf = require('../conf/config')

async function CreateAccount() {
    var res = await account.CreateAccount(conf.AccountId, 'test1')
    console.log(res)
    process.exit()
}
/*
{ 
    privateKey: '2e7db6ad9f36dbcd673423a6b8fee573319f26953627ec82a1111ce4509877f9',
    publicKey: '8e19ad5fb55fb910f10c030711fe9760019e7b85cd9a7a45de21b9636746f54d67ec52e968258efa526780debae60575565b9cb042f9386ea6cea6c319363fca' 
}
*/


async function QueryAccount() {
    var userId = 'test1'
    var res = await account.QueryAccount(userId)
    console.log(res) // 0xa37b71a9a8e7a103ed6010cca9e21db321315bc3a29a386cc55ec69c05a15444
    process.exit()
}

// CreateAccount()
// QueryAccount()