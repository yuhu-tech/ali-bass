"use strict";
function _objectSpread(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = null != arguments[e] ? arguments[e] : {},
      r = Object.keys(n);
    "function" == typeof Object.getOwnPropertySymbols &&
      (r = r.concat(
        Object.getOwnPropertySymbols(n).filter(function (e) {
          return Object.getOwnPropertyDescriptor(n, e).enumerable;
        })
      )),
      r.forEach(function (e) {
        _defineProperty(t, e, n[e]);
      });
  }
  return t;
}
function _defineProperty(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
var MESSAGE = require("@alipay/mychain/build/ant3/config/messageType"),
  APINAME = require("@alipay/mychain/build/ant3/config/apiName"),
  TRANSACTIONTYPE = require("@alipay/mychain/build/ant3/config/transactionType"),
  _require = require("@alipay/mychain/build/ant3/config/rlpParam"),
  handshake = _require.handshake,
  hash = _require.hash,
  timestamp = _require.timestamp,
  msg_type = _require.msg_type,
  transaction_index = _require.transaction_index,
  identity = _require.identity,
  level = _require.level,
  topic = _require.topic,
  sequence = _require.sequence,
  group_id = _require.group_id,
  return_code = _require.return_code,
  encrypted_tx = _require.encrypted_tx,
  Message = _require.Message,
  Request = _require.Request,
  Response = _require.Response,
  Tx = _require.Tx,
  Receipt = _require.Receipt,
  block_number = _require.block_number,
  BlockHeader = _require.BlockHeader,
  BlockBody = _require.BlockBody,
  Block = _require.Block,
  recover_key = _require.recover_key,
  auth_key = _require.auth_key,
  auth_weight = _require.auth_weight,
  Account = _require.Account,
  OldAccount = _require.OldAccount,
  Contract = _require.Contract,
  node_id = _require.node_id,
  P2pStatus = _require.P2pStatus,
  NodeInfo = _require.NodeInfo,
  SyncStatus = _require.SyncStatus,
  TransactionCacheInfo = _require.TransactionCacheInfo,
  BlockCacheInfo = _require.BlockCacheInfo,
  cCode = _require.cCode,
  parameter = _require.parameter,
  payload = _require.payload,
  event_type = _require.event_type,
  filter_id = _require.filter_id,
  event_data_type = _require.event_data_type,
  event_data = _require.event_data,
  httpParam = require("@alipay/mychain/build/ant3/config/httpParam"),
  paramFormat = require("@alipay/mychain/build/ant3/config/paramFormat"),
  Util = require("@alipay/mychain/build/ant3/util");
function _dataTransform(e, t) {
  for (var n = [], r = 0; r < e.length; r++) {
    var a = e[r];
    if (!Array.isArray(a) || a.rlp) {
      var s = t[a.name] || a.value || "",
        u = a.type;
      a.rlp && (u = "bytes");
      var _ = paramFormat["input" + u];
      _ && (s = "code" === u && t.type ? _(s, t.type, t.parameters) : _(s)),
        (n[r] = s);
    } else n[r] = _dataTransform(a, t);
  }
  return n;
}
function dataTransform(e, t) {
  var n = apiNameMap[e];
  if (!n) throw new Error(e + " is not api");
  return _dataTransform(n.data, t);
}
function _requestTransform(e, t, n) {
  for (var r = [], a = 0; a < n.length; a++) {
    var s = n[a];
    if (!Array.isArray(s) || s.rlp) {
      var u = s.name,
        _ = t[u] || s.value || "";
      if ("msg_type" === u) _ = apiNameMap[e].request_msg_type;
      else if ("transaction_type" === u)
        (_ = apiNameMap[e].transaction_type),
          e === APINAME.LocalTransaction && (_ = t.type);
      else {
        var o = s.type;
        s.rlp && (o = "bytes");
        var p = paramFormat["input" + o];
        p && (_ = p(_));
      }
      r[a] = _;
    } else r[a] = _requestTransform(e, t, s);
  }
  return r;
}
function requestTransform(e, t) {
  var n = apiNameMap[e];
  if (!n) throw new Error(e + " is not api");
  return _requestTransform(e, t, n.request);
}
function getResponseValue(e, t) {
  if (Util.isBuffer(t)) {
    var n = e.type,
      r = paramFormat["output" + n];
    return r ? r(t) : t.toString("hex");
  }
  return t || e.value || "";
}
function _responseTransformItem(e, t) {
  var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {},
    r = t.name,
    a = t.type;
  if (Array.isArray(t) && e)
    if ("array" === a && Array.isArray(e)) {
      var s = [];
      if ("one" === t.array_type)
        e.forEach(function (e) {
          s.push(getResponseValue(t[0], e));
        });
      else if ("number" == typeof t.array_type)
        for (var u = t.slice(0), _ = 0; _ < e.length; _ += 2)
          s.push(_responseTransform([e[_], e[_ + 1]], u));
      else
        e.forEach(function (e) {
          s.push(_responseTransform(e, t));
        });
      n[r || "arr"] = s;
    } else if (t.rlp) {
      n = _responseTransformItem(Util.rlp_decode(e), t, n);
    } else
      r ? (n[r] = _responseTransform(e, t)) : (n = _responseTransform(e, t, n));
  else n[r] = getResponseValue(t, e);
  return n;
}
function _responseTransform(e, t) {
  for (
    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {},
      r = 0;
    r < t.length;
    r++
  ) {
    n = _responseTransformItem((Array.isArray(e) ? e[r] : e) || "", t[r], n);
  }
  return n;
}
function responseTransform(e) {
  var t = parseInt(e[0], 16);
  e[0] && Util.isBuffer(e[0]) && (t = parseInt(e[0].toString("hex"), 16));
  var n = apiTypeMap[t];
  if (!n) {
    if (e[0] && e[0][0]) {
      var r = _responseTransform(e, handshake);
      return (r.api = "Handshake"), r;
    }
    throw new Error('msg_type "' + t + '" is not error');
  }
  var a = n.name,
    s = _responseTransform(e, n.response);
  return (s.api = a), s;
}
function getHashForAccount(e, t) {
  return Util.isString(e) && "0x" === e.substr(0, 2) && 66 === e.length
    ? t
      ? e.substr(2)
      : e
    : Util.getHash(e, t);
}
function decryptTXWithAES(e, t, n) {
  if (!e) throw new Error("aes empty key or iv or tag!");
  var r = (e = Util.hexToBuffer(e)).length,
    a = Util.decryptAESTX(e.slice(258, r), Util.generateAESKey(t, n));
  return _responseTransform(Util.rlp_decode(a), Tx);
}
function eventDataFormat(e, t) {
  switch (e) {
    case "Account":
      return eventAccountDataFormat(t);
    case "Contract":
      return eventContractDataFormat(t);
    case "Topics":
      return eventTopicsDataFormat(t);
    case "Block":
      return eventBlockDataFormat(t);
  }
}
function eventAccountDataFormat(e) {
  return _responseTransform(e, [[OldAccount]]);
}
function eventContractDataFormat(e) {
  var t = _responseTransform(e, [[Account]]);
  return t && t.account ? t.account : null;
}
function eventTopicsDataFormat(e) {
  return _responseTransform(e, [[[topic, { name: "data", type: "bytes" }]]]);
}
function eventBlockDataFormat(e) {
  return _responseTransform(e, [[BlockHeader]]);
}
function _httpOutput(e, t, n) {
  if (Util.isObject(e)) {
    var r = {};
    for (var a in e) {
      var s = e[a],
        u = t[a];
      if (u)
        if (u.mapInfo) {
          var _ = u.mapInfo.key || { name: "key" },
            o = u.mapInfo.value || { name: "value" };
          if ("array" === u.type) {
            var p = [];
            for (var i in s) {
              var c = {};
              (c[_.name] = _httpOutput(i, t, _)),
                (c[o.name] = _httpOutput(s[i], t, o)),
                p.push(c);
            }
            r[u.name || a] = p;
          } else {
            var E = {};
            for (var T in s)
              (E[_.name] = _httpOutput(T, t, _)),
                (E[o.name] = _httpOutput(s[T], t, o));
            r[u.name || a] = E;
          }
        } else {
          r[u.name || a] = _httpOutput(s, t, u);
        }
      else r[a] = s;
    }
    return r;
  }
  if (Array.isArray(e)) {
    var m = [],
      y = n;
    n && "array" === n.type && "one" === n.array_type && (y = n[0]);
    for (var A = 0; A < e.length; A++) m.push(_httpOutput(e[A], t, y));
    return m;
  }
  if (n && n.type && "topic" !== n.name) {
    var S = paramFormat["output" + n.type];
    if (S) return S(e, 10);
  }
  return e;
}
function httpOutput(e, t) {
  return httpParam[e] ? _httpOutput(t, httpParam[e]) : t;
}
function getTxData(e, t, n) {
  var r = {
    type: t.transaction_type,
    group_id: e.groupId || "0x0000000000000000000000000000000000000000",
    timestamp: e.timestamp,
    nonce: e.nonce || e.timestamp,
    period: e.period || 100,
    from: e.from,
    to: e.to,
    value: e.value || 0,
    gas: e.gas || 1e7,
    version: e.tx_version || 2,
    extensions: [],
    data: e.data || "0x0",
  };
  t.sequence && (r.sequence = t.sequence);
  var a = Util.getHash(
      Util.rlp_encode([
        r.type,
        r.timestamp,
        r.nonce,
        r.period,
        r.from,
        r.to,
        r.value,
        r.gas,
        r.group_id,
        r.version,
        r.data,
        r.extensions,
      ])
    ),
    s = Util.sign(a, n);
  return (r.hash = a), (r.signature = Util.bufferToHex(s)), r;
}
function getEncryptedTxData(e, t, n, r, a) {
  var s = {
    type: t.transaction_type,
    group_id: e.groupId || "0x0000000000000000000000000000000000000000",
    timestamp: r,
    nonce: e.nonce || Date.now(),
    period: e.period || 100,
    from: "0x0",
    to: "0x0",
    value: e.value || 0,
    gas: e.gas || 1e7,
    version: e.tx_version || 2,
    extensions: [],
    data: e.data || "0x0",
  };
  return (
    t.sequence && (s.sequence = t.sequence),
    (s.hash = a),
    (s.signature = "0x0"),
    s
  );
}
function remove0x(e) {
  return Util.isString(e) && 0 === e.indexOf("0x") ? e.slice(2) : e;
}
function getHttpData(e, t, n) {
  var r = getTxData(e, t, n);
  for (var a in r) {
    var s = r[a];
    r[a] = "signature" === a ? [remove0x(s)] : remove0x(s);
  }
  return r;
}
function getEncryptedHttpData(e, t, n, r, a) {
  var s = getEncryptedTxData(e, t, n, r, a);
  for (var u in s) {
    var _ = s[u];
    s[u] = "signature" === u ? [] : remove0x(_);
  }
  return s;
}
var apiList = [
    {
      name: APINAME.CreateAccount,
      topics: "create_account",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_ACCOUT_CREATE,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_ACCOUT_CREATE,
      transaction_type: TRANSACTIONTYPE.TX_CREATE_ACCOUNT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: Account,
      dataInput: function (e) {
        (e.from = getHashForAccount(e.from)), (e.to = getHashForAccount(e.to));
        var t = e.data;
        t.identity = e.to;
        var n = [];
        if (Array.isArray(t.auth_map))
          for (var r = t.auth_map, a = 0; a < r.length; a++) {
            var s = r[a];
            s.auth_key &&
              s.auth_weight &&
              (n.push(s.auth_key), n.push(s.auth_weight));
          }
        else n.push(t.auth_key), n.push(t.auth_weight);
        return (
          (t.auth_map = Util.rlp_encode(n)),
          (e.data = Util.rlp_encode(dataTransform(APINAME.CreateAccount, t))),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.TransferBalance,
      topics: "transfer_balance",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_TRANS_BALANCE,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_TRANS_BALANCE,
      transaction_type: TRANSACTIONTYPE.TX_TRANSFER_BALANCE,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data = "0x0"),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.SetRecoverkey,
      topics: "set_recover_key",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_SET_RECOVERY_KEY,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_SET_RECOVERY_KEY,
      transaction_type: TRANSACTIONTYPE.TX_SET_RECOVER_KEY,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [recover_key],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = e.from),
          (e.data = dataTransform(APINAME.SetRecoverkey, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.PreResetPubKey,
      topics: "",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_PRE_RESET_PUB_KEY,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_PRE_RESET_PUB_KEY,
      transaction_type: TRANSACTIONTYPE.TX_PRE_RESET_PUB_KEY,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = e.from),
          (e.data = "0x0"),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userRecoverPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(
            this.dataInput(t),
            n,
            n.userRecoverPrivateKey
          ),
        };
      },
    },
    {
      name: APINAME.ResetPubKey,
      topics: "",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_RESET_PUB_KEY,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_RESET_PUB_KEY,
      transaction_type: TRANSACTIONTYPE.TX_RESET_PUB_KEY,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [auth_key, auth_weight],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = e.from),
          (e.data = dataTransform(APINAME.ResetPubKey, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userRecoverPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(
            this.dataInput(t),
            n,
            n.userRecoverPrivateKey
          ),
        };
      },
    },
    {
      name: APINAME.UpdateAuthMap,
      topics: "",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_UPDATE_AUTH_MAP,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_UPDATE_AUTH_MAP,
      transaction_type: TRANSACTIONTYPE.TX_UPDATE_AUTH_MAP,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [auth_key, auth_weight],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = e.from),
          (e.data = dataTransform(APINAME.UpdateAuthMap, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.FreezeAccount,
      topics: "",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_FREEZE_ACCOUNT,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_FREEZE_ACCOUNT,
      transaction_type: TRANSACTIONTYPE.TX_FREEZE_ACCOUNT_CONTRACT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.from)),
          (e.data = "0x0"),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.FreezeContract,
      topics: "",
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_FREEZE_CONTRACT,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_FREEZE_CONTRACT,
      transaction_type: TRANSACTIONTYPE.TX_FREEZE_ACCOUNT_CONTRACT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data = "0x0"),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.NativeDepositData,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_NATIVE_DEPOSIT_DATA,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_NATIVE_DEPOSIT_DATA,
      transaction_type: TRANSACTIONTYPE.TX_NATIVE_DEPOSIT_DATA,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [payload],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data = dataTransform(APINAME.NativeDepositData, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.QueryLastBlock,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_LAST_BLOCK,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_LAST_BLOCK,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response, Block]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.QueryBlockHeader,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_BLOCK_HEADER,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_BLOCK_HEADER,
      transaction_type: "",
      request: [msg_type, [Request, block_number, hash]],
      response: [msg_type, [Response, BlockHeader]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return {
          sequence: n.sequence,
          block_number: t.block_number || 0,
          hash: t.hash || "0x0",
        };
      },
      httpInput: function (e, t, n) {
        return {
          block_number: t.block_number || 0,
          hash: remove0x(t.hash) || "0",
        };
      },
    },
    {
      name: APINAME.QueryBlock,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_BLOCK,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_BLOCK,
      transaction_type: "",
      request: [msg_type, [Request, block_number, hash]],
      response: [msg_type, [Response, Block]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return {
          sequence: n.sequence,
          block_number: t.block_number || 0,
          hash: t.hash || "0x0",
        };
      },
      httpInput: function (e, t, n) {
        return {
          block_number: t.block_number || 0,
          hash: remove0x(t.hash) || "0",
        };
      },
    },
    {
      name: APINAME.QueryTransaction,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_TRANSACTION,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_TRANSACTION,
      transaction_type: "",
      request: [msg_type, [Request, hash]],
      response: [msg_type, [Response, Tx, block_number, transaction_index]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, hash: t.hash };
      },
      httpInput: function (e, t, n) {
        return { hash: remove0x(t.hash) };
      },
    },
    {
      name: APINAME.QueryTransactionReceipt,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_TRANSACTION_RECEIPT,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_TRANSACTION_RECEIPT,
      transaction_type: "",
      request: [msg_type, [Request, hash]],
      response: [
        msg_type,
        [Response, Receipt, block_number, transaction_index],
      ],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, hash: t.hash };
      },
      httpInput: function (e, t, n) {
        return { hash: remove0x(t.hash) };
      },
    },
    {
      name: APINAME.QueryAccount,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_ACCOUNT,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_ACCOUNT,
      transaction_type: "",
      request: [msg_type, [Request, hash]],
      response: [msg_type, [Response, Account]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, hash: t.from };
      },
      httpInput: function (e, t, n) {
        return { id: getHashForAccount(t.from, !0) };
      },
    },
    {
      name: APINAME.QueryContract,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_ACCOUNT,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_ACCOUNT,
      transaction_type: "",
      request: [msg_type, [Request, hash]],
      response: [msg_type, [Response, Contract]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, hash: t.from };
      },
      httpInput: function (e, t, n) {
        return { id: getHashForAccount(t.from, !0) };
      },
    },
    {
      name: APINAME.QueryTimestamp,
      request_msg_type: MESSAGE.MSG_TYPE_QUERY_REQ_TS,
      response_msg_type: MESSAGE.MSG_TYPE_QUERY_RESP_TS,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response, timestamp]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.QueryP2PStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_P2P,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_P2P,
      transaction_type: "",
      request: [msg_type, Request, node_id],
      response: [msg_type, [Response, P2pStatus]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return { node_id: remove0x(t.node_id) || 0 };
      },
    },
    {
      name: APINAME.QueryConsensusStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_CONSENSUS,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_PBFT,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.QuerySyncStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_SYNC,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_SYNC,
      transaction_type: "",
      request: [msg_type, Request, node_id],
      response: [msg_type, [Response, SyncStatus]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return { node_id: remove0x(t.node_id) || 0 };
      },
    },
    {
      name: APINAME.QueryTransactionCacheStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_TX_CACHE,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_TX_CACHE,
      transaction_type: "",
      request: [msg_type, Request, node_id],
      response: [msg_type, [Response, TransactionCacheInfo]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return { node_id: remove0x(t.node_id) || 0 };
      },
    },
    {
      name: APINAME.QueryBlockCacheStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_BLOCK_CACHE,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_BLOCK_CACHE,
      transaction_type: "",
      request: [msg_type, Request, node_id],
      response: [msg_type, [Response, BlockCacheInfo]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return { node_id: remove0x(t.node_id) || 0 };
      },
    },
    {
      name: APINAME.QueryContractNodesStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_CONTRACT_NODES,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_CONTRACT_NODES,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response, NodeInfo]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.QueryContractConfigStatus,
      request_msg_type: MESSAGE.MSG_TYPE_STATUS_REQ_CONTRACT_CONFIG,
      response_msg_type: MESSAGE.MSG_TYPE_STATUS_RESP_CONTRACT_CONFIG,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.QueryLogLevel,
      request_msg_type: MESSAGE.MSG_TYPE_ADMIN_REQ_LOG_LEVEL,
      response_msg_type: MESSAGE.MSG_TYPE_ADMIN_RESP_LOG_LEVEL,
      transaction_type: "",
      request: [msg_type, Request],
      response: [msg_type, [Response, level]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence };
      },
      httpInput: function (e, t, n) {
        return {};
      },
    },
    {
      name: APINAME.DeployContract,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_CONTRACT_DEPLOY,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_CONTRACT_DEPLOY,
      transaction_type: TRANSACTIONTYPE.TX_DEPLOY_CONTRACT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [cCode],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data = dataTransform(APINAME.DeployContract, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.UpdateContract,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_CONTRACT_UPDATE,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_CONTRACT_UPDATE,
      transaction_type: TRANSACTIONTYPE.TX_UPDATE_CONTRACT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [cCode],
      dataInput: function (e) {
        return (
          (e.to = getHashForAccount(e.to)),
          (e.from = e.from ? getHashForAccount(e.from) : e.to),
          (e.data = dataTransform(APINAME.UpdateContract, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.CallContract,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_CONTRACT_CALL,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_CONTRACT_CALL,
      transaction_type: TRANSACTIONTYPE.TX_CALL_CONTRACT,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [parameter],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data = dataTransform(APINAME.CallContract, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        return getTxData(this.dataInput(t), n, n.userPrivateKey);
      },
      httpInput: function (e, t, n) {
        return {
          transaction: getHttpData(this.dataInput(t), n, n.userPrivateKey),
        };
      },
    },
    {
      name: APINAME.EventAccount,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_ACCOUNT,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_FILTER_ID,
      transaction_type: "",
      request: [msg_type, [Request, event_type, identity]],
      response: [msg_type, [Response, filter_id]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, type: t.type, identity: t.identity };
      },
      httpInput: function (e, t, n) {
        return { event_type: t.type || 0, id: Util.getHash(t.identity, !0) };
      },
    },
    {
      name: APINAME.EventContract,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_CONTRACT,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_FILTER_ID,
      transaction_type: "",
      request: [msg_type, [Request, event_type, identity]],
      response: [msg_type, [Response, filter_id]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, type: t.type, identity: t.identity };
      },
      httpInput: function (e, t, n) {
        return { event_type: t.type || 0, id: Util.getHash(t.identity, !0) };
      },
    },
    {
      name: APINAME.EventTopics,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_TOPICS,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_FILTER_ID,
      transaction_type: "",
      request: [msg_type, [Request, event_type, [topic]]],
      response: [msg_type, [Response, filter_id]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, type: t.type, topic: t.identity };
      },
      httpInput: function (e, t, n) {
        return { event_type: t.type || 0, topics: [t.identity] };
      },
    },
    {
      name: APINAME.EventBlock,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_BLOCK,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_FILTER_ID,
      transaction_type: "",
      request: [msg_type, [Message, event_type, sequence, group_id]],
      response: [msg_type, [Response, filter_id]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, type: t.type };
      },
      httpInput: function (e, t, n) {
        return { event_type: t.type || 0 };
      },
    },
    {
      name: APINAME.EventFetch,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_FETCH,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_FETCH,
      transaction_type: "",
      request: [msg_type, [Request, filter_id]],
      response: [msg_type, [Response, event_data_type, event_data]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, filter_id: t.filter_id };
      },
      httpInput: function (e, t, n) {
        return { filter_id: t.filter_id };
      },
    },
    {
      name: APINAME.EventCancel,
      request_msg_type: MESSAGE.MSG_TYPE_EVENT_REQ_CANCEL,
      response_msg_type: MESSAGE.MSG_TYPE_EVENT_RESP_CANCEL,
      transaction_type: "",
      request: [msg_type, [Request, [filter_id]]],
      response: [msg_type, [Message, sequence, return_code, group_id]],
      data: [],
      dataInput: function (e) {
        return e;
      },
      nodeInput: function (e, t, n) {
        return { sequence: n.sequence, filter_id: t.filter_id };
      },
      httpInput: function (e, t, n) {
        return { filter_ids: [t.filter_id] };
      },
    },
    {
      name: APINAME.LocalTransaction,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_LOCAL,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_LOCAL,
      request: [msg_type, [Request, block_number, Tx]],
      response: [msg_type, [Response, hash, Receipt]],
      data: [],
      dataInput: function (e) {
        return e.encrypt
          ? apiNameMap[APINAME.EncryptedTransaction].dataInput(e)
          : apiNameMap[e.apiName].dataInput(e);
      },
      nodeInput: function (e, t, n) {
        var r = {};
        return (
          ((r = t.encrypt
            ? ((n.transaction_type = TRANSACTIONTYPE.TX_CONFIDENTIAL),
              apiNameMap[APINAME.EncryptedTransaction].nodeInput(
                t.apiName,
                t,
                n
              ))
            : ((n.transaction_type = apiNameMap[t.apiName].transaction_type),
              apiNameMap[t.apiName].nodeInput(t.apiName, t, n))).block_number =
            t.block_number),
          r
        );
      },
      httpInput: function (e, t, n) {
        var r = {};
        return (
          ((r = t.encrypt
            ? ((n.transaction_type = TRANSACTIONTYPE.TX_CONFIDENTIAL),
              apiNameMap[APINAME.EncryptedTransaction].httpInput(
                t.apiName,
                t,
                n
              ))
            : ((n.transaction_type = apiNameMap[t.apiName].transaction_type),
              apiNameMap[t.apiName].httpInput(t.apiName, t, n))).block_number =
            t.block_number || 0),
          r
        );
      },
    },
    {
      name: APINAME.EncryptedTransaction,
      request_msg_type: MESSAGE.MSG_TYPE_TX_REQ_CONFIDENTIAL_TX,
      response_msg_type: MESSAGE.MSG_TYPE_TX_RESP_CONFIDENTIAL_TX,
      transaction_type: TRANSACTIONTYPE.TX_CONFIDENTIAL,
      request: [msg_type, [Request, Tx]],
      response: [msg_type, [Response, hash]],
      data: [encrypted_tx],
      dataInput: function (e) {
        return (
          (e.from = getHashForAccount(e.from)),
          (e.to = getHashForAccount(e.to)),
          (e.data =
            dataTransform(APINAME.EncryptedTransaction, e.data)[0] || ""),
          e
        );
      },
      nodeInput: function (e, t, n) {
        var r = _objectSpread({}, n);
        r.transaction_type = apiNameMap[t.apiName].transaction_type;
        var a = apiNameMap[t.apiName].nodeInput(t.apiName, t, r),
          s = Util.rlp_encode(_requestTransform(t.apiName, a, Tx), !0);
        return (
          (t.data = {
            encrypted_tx: Util.sealSGXWithPassword(
              t.rsaPublicKey,
              s,
              t.aesKey,
              a.hash
            ),
          }),
          getEncryptedTxData(
            this.dataInput(t),
            n,
            n.userPrivateKey,
            a.timestamp,
            a.hash
          )
        );
      },
      httpInput: function (e, t, n) {
        var r = _objectSpread({}, n);
        r.transaction_type = apiNameMap[t.apiName].transaction_type;
        var a = apiNameMap[t.apiName].nodeInput(t.apiName, t, r),
          s = Util.rlp_encode(_requestTransform(t.apiName, a, Tx), !0);
        return (
          (t.data = {
            encrypted_tx: Util.sealSGXWithPassword(
              t.rsaPublicKey,
              s,
              t.aesKey,
              a.hash
            ),
          }),
          {
            transaction: getEncryptedHttpData(
              this.dataInput(t),
              n,
              n.userPrivateKey,
              a.timestamp,
              a.hash
            ),
          }
        );
      },
    },
  ],
  apiTypeMap = {},
  apiNameMap = {};
apiList.forEach(function (e) {
  (apiNameMap[e.name] = e), (apiTypeMap[e.response_msg_type] = e);
}),
  (Util.decryptTXWithAES = decryptTXWithAES),
  (module.exports = _objectSpread({}, apiNameMap, {
    requestTransform: requestTransform,
    responseTransform: responseTransform,
    dataTransform: dataTransform,
    eventDataFormat: eventDataFormat,
    getTxData: getTxData,
    httpOutput: httpOutput,
  }));
