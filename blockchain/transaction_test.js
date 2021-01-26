const transaction = require('./transaction')

async function QueryTransaction() {
    var res = await transaction.QueryTransaction('0x6012eed5864fb2c3b13052ab9c5ebcee49f9ab59b46a0bd438ba0fb5f055f6d1')
    console.log(res)
    process.exit()
}

async function QueryTransactionReceipt(params) {
    var res = await transaction.QueryTransactionReceipt('0x6012eed5864fb2c3b13052ab9c5ebcee49f9ab59b46a0bd438ba0fb5f055f6d1')
    console.log(res)
    process.exit()
}

// QueryTransaction()
QueryTransactionReceipt()