const token = require('./token')

async function TestDeploy() {
    let data = await token.Deploy(
        "TestToken04",
        "sdk-test-ted",
        "TestToken04",
        "TTT4",
        4,
        100000000,
    )
    console.log(data)
    process.exit()
}

async function TestName() {
    let output = await token.Name(
        "TestToken04",
        "sdk-test-ted",
    )
    console.log("token name: ", output)
}

async function TestSymbol() {
    let output = await token.Symbol(
        "TestToken04",
        "sdk-test-ted",
    )
    console.log("token symbol: ", output)
}

async function TestDecimals() {
    let output = await token.Decimals(
        "TestToken04",
        "sdk-test-ted",
    )
    console.log("token decimals: ", output)
}

async function TestTotalSupply() {
    let output = await token.TotalSupply(
        "TestToken04",
        "sdk-test-ted",
    )
    console.log("token totalSupply: ", output)
}

async function TestBalanceOf() {
    let account = "0xcbaf07a6da5f3cff3eea0db079e5a3b952379985b419d20df0d4672e89189b12"
    let output = await token.BalanceOf(
        "TestToken04",
        "sdk-test-ted",
        account
    )
    console.log("token balanceof: ", output)
}

async function TestIsOwner() {
    let output = await token.IsOwner(
        "TestToken04",
        "sdk-test-ted",
    )
    console.log("token sdk-test-ted isOwner: ", output)
}

// TestDeploy()
TestName()
TestSymbol()
TestDecimals()
TestTotalSupply()
TestBalanceOf()
TestIsOwner()
