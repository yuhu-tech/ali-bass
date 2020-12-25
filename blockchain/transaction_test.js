const transaction = require('./transaction')

async function QueryTransaction() {
    var res = await transaction.QueryTransaction('0x553b89b08b28dd920efe27388a2fa206a6aaf6ec254d0a72ca2538e285c1d78f')
    console.log(res)
    process.exit()
}

async function QueryTransactionReceipt(params) {
    var res = await transaction.QueryTransactionReceipt('0x553b89b08b28dd920efe27388a2fa206a6aaf6ec254d0a72ca2538e285c1d78f')
    console.log(res)
    process.exit()
}

// QueryTransaction()
// QueryTransactionReceipt()