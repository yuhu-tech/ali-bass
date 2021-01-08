const Chain = require("@alipay/mychain/index.node")
const fs = require('fs')
const path = require('path')
const env = require('../../env/env')
const { reject } = require("bluebird")
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, '../../generate/token/solidity_token_Token_sol_Token.abi'), String))
const bytecode = fs.readFileSync(path.join(__dirname, '../../generate/token/solidity_token_Token_sol_Token.bin'))

function Deploy(contractName, from, name, symbol, decimals, totalSupply) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.new(bytecode, {
            from: from,
            parameters: [name, symbol, decimals, totalSupply]
        }, (err, contract, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

}

function Name(contractName, from) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.name({ from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function Symbol(contractName, from) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.symbol({ from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function Decimals(contractName, from) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.decimals({ from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function TotalSupply(contractName, from) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.totalSupply({ from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function BalanceOf(contractName, from, account) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.balanceOf(account, { from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function IsOwner(contractName, from) {
    return new Promise((resolve, reject) => {
        let tokenContract = env.chain.ctr.contract(contractName, abi)
        tokenContract.isOwner({ from: from }, (err, output, data) => {
            if (err != null) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

function Approve(contractName, from) {
    // TODO
}

/*
 * from 转账发起用户id或者identity
 * publicKey 用户公钥
 * privateKey 用户私钥
 * to 转账目标账户identity
 * value 转账数量
*/
function Transfer(contractName, from, priK, pubK, to, value) {
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
            } else {
                console.log("data: ", data)
                console.log("output: ", output)
            }
        })
    })
}

function TransferFrom(contractName, from) {
    // TODO
}

function TrasferFromTxOrigin(contractName, from) {
    // TODO
}



module.exports = {
    Deploy,
    Name,
    Symbol,
    Decimals,
    TotalSupply,
    BalanceOf,
    IsOwner,
    Approve,
    Transfer,
    TransferFrom,
    TrasferFromTxOrigin
}
