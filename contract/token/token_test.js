const token = require("./token");
const apiName = require("@alipay/mychain/build/ant3/config/apiName");

async function TestDeploy() {
  let contractName = "TestToken" + Date.parse(new Date());
  // let contractName = "TestToken" + "1611642882505";
  let res = await token.Deploy({
    contractName: contractName,
    from: "sdk-test-ted",
    priK: "f6d61356ccb24e842ed401a7442c749466db45da0dd573b6c6d7fa335b077891",
    pubK:
      "9f26860dd28e5d63fe4d495b172bd7ff2094d73bcf1b4bcb4697d61b15ae280f302d103da78ead8a0df2df48caa4063e46abf4b839bbb9e3147a3366f3156d46",
    name: "TestToken",
    symbol: "TTT",
    decimals: 4,
    totalSupply: 100000000,
    timestamp: Date.now(),
    isMakeHash: false, // true:make txhash false:send transaction
  });
  console.log(res.data);
}

async function TestName() {
  let output = await token.Name("TestToken1611642882505");
  console.log("token name: ", output);
}

async function TestSymbol() {
  let output = await token.Symbol("TestToken1611642882505");
  console.log("token symbol: ", output);
}

async function TestDecimals() {
  let output = await token.Decimals("TestToken1611642882505");
  console.log("token decimals: ", output);
}

async function TestTotalSupply() {
  let output = await token.TotalSupply("TestToken1611642882505");
  console.log("token totalSupply: ", output);
}

async function TestBalanceOf() {
  let output = await token.BalanceOf(
    "TestToken1611642882505",
    "0x60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752"
  );
  console.log("token balanceof: ", output);
}

async function TestIsOwner() {
  let output = await token.IsOwner("TestToken1611642882505");
  console.log("token sdk-test-ted isOwner: ", output);
}

async function TestAllowance() {
  let output = await token.Allowance(
    "TestToken1611642882505",
    "0xcbaf07a6da5f3cff3eea0db079e5a3b952379985b419d20df0d4672e89189b12", // sdk-test-ted
    "0x1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014" // test1
  );
  console.log("token allowance: ", output);
}

async function TestApprove() {
  let output = await token.Approve({
    ontractName: "TestToken1611642882505",
    from: "sdk-test-ted",
    priK: "f6d61356ccb24e842ed401a7442c749466db45da0dd573b6c6d7fa335b077891",
    pubK:
      "9f26860dd28e5d63fe4d495b172bd7ff2094d73bcf1b4bcb4697d61b15ae280f302d103da78ead8a0df2df48caa4063e46abf4b839bbb9e3147a3366f3156d46",
    to: "0x1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014",
    value: 1000000,
    timestamp: Date.now(),
    isMakeHash: true,
  });
  if (res.output != null) {
    console.log("token approve output: ", res.output);
  } else {
    console.log("token approve data: ", res.data);
  }
}

async function TestTransfer() {
  let res = await token.Transfer({
    contractName: "TestToken1611642882505",
    from: "sdk-test-ted",
    priK: "f6d61356ccb24e842ed401a7442c749466db45da0dd573b6c6d7fa335b077891",
    pubK:
      "9f26860dd28e5d63fe4d495b172bd7ff2094d73bcf1b4bcb4697d61b15ae280f302d103da78ead8a0df2df48caa4063e46abf4b839bbb9e3147a3366f3156d46",
    to: "0x60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752",
    value: 1000000,
    timestamp: Date.now(), 
    isMakeHash: false, // true:make txhash false:send transaction
  });
  if (res.output != null) {
    console.log("token transfer output: ", res.output);
  } else {
    console.log("token transfer data: ", res.data);
  }
}

// TestDeploy();
// TestName()
// TestSymbol()
// TestDecimals()
// TestTotalSupply()
// TestBalanceOf()
// TestIsOwner()
// TestAllowance()
// TestApprove()
// TestTransfer();
