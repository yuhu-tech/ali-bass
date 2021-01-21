const transaction = require('./transaction')

async function QueryTransaction() {
    var res = await transaction.QueryTransaction('0xdee4a1f2fa48b5c8f4e208cfd62cdf460df7732ae2748ce95a761e05682fb1e2')
    console.log(res)
    process.exit()
}

async function QueryTransactionReceipt(params) {
    var res = await transaction.QueryTransactionReceipt('0xdee4a1f2fa48b5c8f4e208cfd62cdf460df7732ae2748ce95a761e05682fb1e2')
    console.log(res)
    process.exit()
}

QueryTransaction()
// QueryTransactionReceipt()