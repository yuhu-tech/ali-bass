const Chain = require("../alipay-chain/index.node") //在node 环境使用 TLS 协议
const fs = require("fs")
const path = require('path')
const conf = require("../conf/config")

const accountKey = fs.readFileSync(path.join(__dirname, "../certs/account/user.pem"), { encoding: "utf8" })
const accountPassword = conf.AccountPassword  //需要替换为自定义的 user.pem 密码
const keyInfo = Chain.utils.getKeyInfo(accountKey, accountPassword)
//可打印私钥和公钥，使用 16 进制
//console.log('privateKey: ', keyInfo.privateKey.toString('hex'))

//配置选项
const opt = {
  host: conf.Host,  // 目标区块链网络节点的 IP
  port: conf.Port,  // 端口号
  timeout: 30000,   // 连接超时时间配置
  cert: fs.readFileSync(path.join(__dirname, "../certs/blockchain/client.crt"), { encoding: "utf8" }),        // 证书请求文件，与 
  ca: fs.readFileSync(path.join(__dirname, "../certs/blockchain/ca.crt"), { encoding: "utf8" }),              // 合约链的认证CA 平台申请 
  key: fs.readFileSync(path.join(__dirname, "../certs/blockchain/client.key"), { encoding: "utf8" }),         // RSA秘钥 平台申请
  userPublicKey: keyInfo.publicKey,            // 账户公钥
  userPrivateKey: keyInfo.privateKey,          // 账户私钥
  userRecoverPublicKey: keyInfo.publicKey,     // 恢复账户公钥
  userRecoverPrivateKey: keyInfo.privateKey,   // 恢复账户私钥
  passphrase: conf.Passphrase                  // client.key 密码
}

const chain = Chain(opt);

module.exports = {
  opt,
  chain
}
