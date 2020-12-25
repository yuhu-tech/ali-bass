const env = require("../env/env")

//存证后，如果需要查询存证数据，可通过 QueryTransaction 传入存证交易的 hash 查询
function QueryTransaction(txHash) {
    return new Promise((resolve, reject) => {
        env.chain.ctr.QueryTransaction({
            hash: txHash
        }, (err, data) => {
            if (err != null || data.return_code != 0) {
                reject(Error('query transaction failed', err))
            } else {
                resolve(data)
            }
        })
    }).then(
        res => {
            return res
        }
    )
}

//通过 QueryTransaction 查询到存证交易，证明交易发生，通过 QueryTransactionReceipt 可以验证交易成功（return_code 为0），共识后进入区块。
function QueryTransactionReceipt(txhash) {
    return new Promise((resolve, reject) => {
        env.chain.ctr.QueryTransactionReceipt({
            hash: txhash
        }, (err, data) => {
            if (err != null || data.return_code != 0) {
                reject(Error('query transaction receipt failed', err))
            } else {
                resolve( data )
            }
        })
    }).then(
        res => {
            return res
        }
    )
}

module.exports = {
    QueryTransaction,
    QueryTransactionReceipt
}