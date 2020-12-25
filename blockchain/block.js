const { chain } = require("../env/env")

//调用 API 查询最新的一个区块数据
function QueryLastBlock() {
  return new Promise((resolve, reject) => {
    chain.ctr.QueryLastBlock({}, (err, data) => {
      if (err != null || data.return_code != 0) {
        reject(Error('query last block failed', err))
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

module.exports = {
  QueryLastBlock
}

