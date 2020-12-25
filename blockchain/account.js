const Chain = require("@alipay/mychain/index.node") //在 node 环境使用 TLS 协议
const env = require("../env/env")

function CreateAccount(from, userId) {
    return new Promise((resolve, reject) => {
        const newKey = Chain.utils.generateECKey();
        const privateKey = newKey.privateKey.toString('hex')
        const publicKey = newKey.publicKey.toString('hex')
        env.chain.ctr.CreateAccount({
            from: from,
            to: userId,
            data: {
                recover_key: '0x' + newKey.publicKey.toString('hex'),      // 新账户恢复公钥
                auth_key: '0x' + newKey.publicKey.toString('hex'),         // 新目标账户公钥
                auth_weight: 100                                           // 权重值
            }
        }, (err, data) => {
            if (err != null || data.return_code != 0) {
                reject(Error('create account failed', err))
            }
            resolve({
                privateKey,
                publicKey
            })
        })
    })
}

function QueryAccount(userId) {
    return new Promise((resolve, reject) => {
        env.chain.ctr.QueryAccount({
            from: userId
        }, (err, data) => {
            if (err != null || data.return_code != 0) {
                reject(Error('query account failed'))
            } else {
                var identity = data.data.identity
                resolve({ identity })
            }
        })
    })
}

module.exports = {
    CreateAccount,
    QueryAccount
}