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

function Deploy(req) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = req.pubK;
    env.opt.userPrivateKey = req.priK;
    env.opt.userRecoverPublicKey = req.pubK;
    env.opt.userRecoverPrivateKey = req.priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);
    let tokenContract = env.chain.ctr.contract(req.contractName, abi);
    tokenContract.new(
      bytecode,
      req.timestamp,
      req.isMakeHash,
      {
        from: req.from,
        parameters: [req.name, req.symbol, req.decimals, req.totalSupply],
      },
      (err, contract, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve({ contract: contract, data: data });
        }
      }
    );
  });
}

function Name(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.name(
      Date.now(),
      false,
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

function Symbol(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.symbol(
      Date.now(),
      false,
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

function Decimals(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.decimals(
      Date.now(),
      false,
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

function TotalSupply(contractName) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.totalSupply(
      Date.now(),
      false,
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

function BalanceOf(contractName, account) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.balanceOf(
      Date.now(),
      false,
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
    tokenContract.isOwner(
      Date.now(),
      false,
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

function Allowance(contractName, owner, spender) {
  return new Promise((resolve, reject) => {
    let tokenContract = env.chain.ctr.contract(contractName, abi);
    tokenContract.allowance(
      Date.now(),
      false,
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

function Approve(req) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = req.pubK;
    env.opt.userPrivateKey = req.priK;
    env.opt.userRecoverPublicKey = req.pubK;
    env.opt.userRecoverPrivateKey = req.priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);
    let myContract = env.chain.ctr.contract(req.contractName, abi);
    myContract.approve(
      req.timestamp,
      req.isMakeHash,
      req.to,
      req.value,
      { from: req.from },
      (err, output, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve({ output: output, data: data });
        }
      }
    );
  });
}

function Transfer(req) {
  return new Promise((resolve, reject) => {
    env.opt.userPublicKey = req.pubK;
    env.opt.userPrivateKey = req.priK;
    env.opt.userRecoverPublicKey = req.pubK;
    env.opt.userRecoverPrivateKey = req.priK;
    env.chain.setUserKey(env.opt);
    env.chain.setUserRecoverKey(env.opt);
    let myContract = env.chain.ctr.contract(req.contractName, abi);
    myContract.transfer(
      req.timestamp, // 时间戳必须为第一个入参
      req.isMakeHash,
      req.to,
      req.value,
      { from: req.from },
      (err, output, data) => {
        if (err != null) {
          reject(err);
        } else {
          resolve({ output: output, data: data });
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
