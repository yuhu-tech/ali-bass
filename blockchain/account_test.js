const account = require('./account')

async function CreateAccount() {
    var res = await account.CreateAccount('xiaobai')
    console.log(res)
}

async function QueryAccount() {
    var userId = 'xiaobai'
    var res = await account.QueryAccount(userId)
    console.log(res)
}

CreateAccount()
QueryAccount()