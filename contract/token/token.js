const fs = require("fs");
const path = require("path");
const env = require("../../env/env");
const conf = require("../../conf/config");
const abi = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../../generate/token/solidity_token_Token_sol_Token.abi"
    ),
    String
  )
);
const bytecode = fs.readFileSync(
  path.join(
    __dirname,
    "../../generate/token/solidity_token_Token_sol_Token.bin"
  )
);

function Deploy(
  contractName,
  from,
  priK,
  pubK,
  name,
  symbol,
  decimals,
  totalSupply
) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = pubK;
    env.opt.userPrivateKey = priK;
    env.opt.userRecoverPublicKey = pubK;
    env.opt.userRecoverPrivateKey = priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.new(
      bytecode,
      {
        from: from,
        parameters: [name, symbol, decimals, totalSupply],
      },
      (err, contract, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(data);
        }
      },
      (txhash) => {
        console.log("===========txhash: ", txhash);
      }
    );
  });
}

function Name(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.name({ from: conf.AccountId }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function Symbol(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.symbol({ from: conf.AccountId }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function Decimals(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.decimals({ from: conf.AccountId }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function TotalSupply(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.totalSupply({ from: conf.AccountId }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function BalanceOf(contractName, account) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.balanceOf(
      account,
      { from: conf.AccountId },
      (err, output, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });
}

function IsOwner(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.isOwner({ from: conf.AccountId }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function Allowance(contractName, owner, spender) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.allowance(
      owner,
      spender,
      { from: conf.AccountId },
      (err, output, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });
}

function Approve(contractName, from, priK, pubK, to, value) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = pubK;
    env.opt.userPrivateKey = priK;
    env.opt.userRecoverPublicKey = pubK;
    env.opt.userRecoverPrivateKey = priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);
    let myContract = env.chain.ctr.contract(contractName, abi);
    myContract.approve(to, value, { from: from }, (err, output, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function Transfer(contractName, from, priK, pubK, to, value) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = pubK;
    env.opt.userPrivateKey = priK;
    env.opt.userRecoverPublicKey = pubK;
    env.opt.userRecoverPrivateKey = priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);

    let myContract = env.chain.ctr.contract(contractName, abi);
    myContract.transfer(
      (txhash) => {
        console.log("========== Transfer txhash: ", txhash); // 调用合约内非 constant 方法，第一个参数必须是 hook 函数
      },
      to,
      value,
      { from: from },
      (err, output, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });
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
  Allowance,
  Approve,
  Transfer,
  TransferFrom,
  TrasferFromTxOrigin,
};
