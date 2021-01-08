const account = require('./account')
const conf = require('../conf/config')

async function CreateAccount() {
    var res = await account.CreateAccount(conf.AccountId, 'test2')
    console.log(res)
    process.exit()
}

async function QueryAccount() {
    var res = await account.QueryAccount('sdk-test-ted')
    console.log(res)
    process.exit()
}

CreateAccount()
// QueryAccount()