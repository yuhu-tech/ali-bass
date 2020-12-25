const Chain = require("@alipay/mychain/index.node") //在 node 环境使用 TLS 协议
const fs = require('fs')
const env = require('../../env/env')
const abi = JSON.parse(fs.readFileSync('../../solidity/MyToken-generate/MyToken_sol_MyToken.abi', String))
const bytecode = fs.readFileSync('../../solidity/MyToken-generate/MyToken_sol_MyToken.bin')

class MyToken {
    Deploy(from, contractName) {
        let myContract = env.chain.ctr.contract(contractName, abi)
        myContract.new(bytecode, {
            from: from,
        }, (err, contract, data) => {
            console.log(err)
            console.log(data)
        })
    }

    Issue(contractName, from, to, value) {
        return new Promise((resolve, reject) => {
            let myContract = env.chain.ctr.contract(contractName, abi)
            myContract.transfer(to, value, { from: from }, (err, output, data) => {
                if (err != null) {
                    reject(err)
                    console.log(data)
                } else {
                    resolve({ output })
                }
            })
        })
    }

    /*
    from 转账发起用户id或者identity
    publicKey 用户公钥
    privateKey 用户私钥
    to 转账目标账户identity
    value 转账数量
    */
    Transfer(contractName, from, publicKey, privateKey, to, value) {
        return new Promise((resolve, reject) => {

            env.opt.userPublicKey = publicKey
            env.opt.userPrivateKey = privateKey
            env.opt.userRecoverPublicKey = publicKey
            env.opt.userRecoverPrivateKey = privateKey
            env.chain.setUserKey(env.opt)
            env.chain.setUserRecoverKey(env.opt)

            let myContract = env.chain.ctr.contract(contractName, abi)
            myContract.transfer(to, value, { from: from }, (err, output, data) => {
                if (err != null) {
                    reject(err)
                    console.log(data)
                } else {
                    resolve({ output })
                }
            })
        })
    }

    // from: 交易发起账户名 sdk-test-ted
    // to: 账户名 
    NativeDepositData(hashData, from, to) {
        return new Promise((resolve, reject) => {
            env.chain.ctr.NativeDepositData({
                from: from,
                to: to,
                data: {
                    payload: hashData  //存证的数据内容，被序列化为 16 进制
                }
            }, (err, data) => {
                if (err != null || data.return_code != 0) {
                    reject(Error('native deposit data failed', err))
                } else {
                    var txhash = data.txhash
                    resolve({ txhash })
                }
            })
        })
    }

    QueryTotalSuppy(contractName, from) {
        return new Promise((resolve, reject) => {
            let myContract = env.chain.ctr.contract(contractName, abi)
            myContract.totalSupply({ from: from }, (err, output, data) => {
                if (err != null) {
                    reject(err)
                } else {
                    var totalSupply = output.c[0]
                    console.log(output)
                    console.log(totalSupply)
                    resolve({ totalSupply })
                }
            })

        })
    }

    QueryBalanceOf(contractName, from, userId) {
        return new Promise((resolve, reject) => {
            let myContract = env.chain.ctr.contract(contractName, abi)
            myContract.balanceOf(userId, { from: from }, (err, output, data) => {
                if (err != null) {
                    reject(err)
                } else {
                    var balance = output.c[0]
                    resolve({ balance })
                }
            })

        })
    }

}

module.exports = {
    MyToken
}