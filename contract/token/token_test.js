const token = require("./token");
const apiName = require("@alipay/mychain/build/ant3/config/apiName");

async function TestDeploy() {
  let data = await token.Deploy(
    "TestToken" + Date.parse(new Date()),
    "sdk-test-ted",
    "f6d61356ccb24e842ed401a7442c749466db45da0dd573b6c6d7fa335b077891",
    "9f26860dd28e5d63fe4d495b172bd7ff2094d73bcf1b4bcb4697d61b15ae280f302d103da78ead8a0df2df48caa4063e46abf4b839bbb9e3147a3366f3156d46",
    "TestToken",
    "TTT",
    4,
    100000000
  );
  console.log(data);
}

async function TestName() {
  let output = await token.Name("TestToken05");
  console.log("token name: ", output);
}

async function TestSymbol() {
  let output = await token.Symbol("TestToken04");
  console.log("token symbol: ", output);
}

async function TestDecimals() {
  let output = await token.Decimals("TestToken04");
  console.log("token decimals: ", output);
}

async function TestTotalSupply() {
  let output = await token.TotalSupply("TestToken04");
  console.log("token totalSupply: ", output);
}

async function TestBalanceOf() {
  let output = await token.BalanceOf(
    "TestToken06",
    "0xfd61a03af4f77d870fc21e05e7e80678095c92d808cfb3b5c279ee04c74aca13"
  );
  console.log("token balanceof: ", output);
}

async function TestIsOwner() {
  let output = await token.IsOwner("TestToken04");
  console.log("token sdk-test-ted isOwner: ", output);
}

async function TestAllowance() {
  let output = await token.Allowance(
    "TestToken04",
    "0xcbaf07a6da5f3cff3eea0db079e5a3b952379985b419d20df0d4672e89189b12", // sdk-test-ted
    "0x1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014" // test1
  );
  console.log("token allowance: ", output);
}

async function TestApprove() {
  let output = await token.Approve(
    "TestToken04",
    "sdk-test-ted",
    "f6d61356ccb24e842ed401a7442c749466db45da0dd573b6c6d7fa335b077891",
    "9f26860dd28e5d63fe4d495b172bd7ff2094d73bcf1b4bcb4697d61b15ae280f302d103da78ead8a0df2df48caa4063e46abf4b839bbb9e3147a3366f3156d46",
    "0x1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014", // test1
    1000000
  );
  console.log("token approve: ", output);
}

async function TestTransfer() {
  let output = await token.Transfer(
    "TestToken05",
    "test2",
    "b9819dfe5dbeb377b8cf77e934c72ba32b381d716119d27fcde8c8f8632db18d",
    "c1ab7a6fdfa89b2420d78bcc9c991f3b40cca54471805ea375152070fa6e1ee26f1ed51ad9314c0612078d7a0e3b0db1515e0767e4a561356c08673a079b6b00",
    "0xcbaf07a6da5f3cff3eea0db079e5a3b952379985b419d20df0d4672e89189b12",
    1000000
  );
  console.log("token transfer: ", output);
}

TestDeploy()
// TestName()
// TestSymbol()
// TestDecimals()
// TestTotalSupply()
// TestBalanceOf()
// TestIsOwner()
// TestAllowance()
// TestApprove()
// TestTransfer()
