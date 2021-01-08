const block = require("./block")

async function QueryLastBlock() {
    var res = await block.QueryLastBlock()
    console.log('test raw data:', res) //区块结构数据
    process.exit()
}

QueryLastBlock()
