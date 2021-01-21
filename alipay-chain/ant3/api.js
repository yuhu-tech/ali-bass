"use strict";
function _objectSpread(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = null != arguments[e] ? arguments[e] : {},
      a = Object.keys(n);
    "function" == typeof Object.getOwnPropertySymbols &&
      (a = a.concat(
        Object.getOwnPropertySymbols(n).filter(function (e) {
          return Object.getOwnPropertyDescriptor(n, e).enumerable;
        })
      )),
      a.forEach(function (e) {
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
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var a = t[n];
    (a.enumerable = a.enumerable || !1),
      (a.configurable = !0),
      "value" in a && (a.writable = !0),
      Object.defineProperty(e, a.key, a);
  }
}
function _createClass(e, t, n) {
  return (
    t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
  );
}
var APINAME = require("@alipay/mychain/build/ant3/config/apiName"),
  Util = require("@alipay/mychain/build/ant3/util"),
  Errors = require("@alipay/mychain/build/ant3/errors"),
  Contract = require("./contract"),
  apiList = [
    {
      apiName: APINAME.CreateAccount,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.TransferBalance,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.SetRecoverkey,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.PreResetPubKey,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.ResetPubKey,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.UpdateAuthMap,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.FreezeAccount,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.FreezeContract,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.NativeDepositData,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    { apiName: APINAME.QueryLastBlock, follow: null },
    { apiName: APINAME.QueryBlockHeader, follow: null },
    { apiName: APINAME.QueryBlock, follow: null },
    { apiName: APINAME.QueryTransaction, follow: null },
    { apiName: APINAME.QueryTransactionReceipt, follow: null },
    { apiName: APINAME.QueryAccount, follow: null },
    { apiName: APINAME.QueryContract, follow: null },
    { apiName: APINAME.QueryTimestamp, follow: null },
    { apiName: APINAME.QueryP2PStatus, follow: null },
    { apiName: APINAME.QueryConsensusStatus, follow: null },
    { apiName: APINAME.QuerySyncStatus, follow: null },
    { apiName: APINAME.QueryTransactionCacheStatus, follow: null },
    { apiName: APINAME.QueryBlockCacheStatus, follow: null },
    { apiName: APINAME.QueryContractNodesStatus, follow: null },
    { apiName: APINAME.QueryContractConfigStatus, follow: null },
    { apiName: APINAME.QueryLogLevel, follow: null },
    {
      apiName: APINAME.DeployContract,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.UpdateContract,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    {
      apiName: APINAME.CallContract,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
    { apiName: APINAME.EventAccount, follow: null },
    { apiName: APINAME.EventContract, follow: null },
    { apiName: APINAME.EventTopics, follow: null },
    { apiName: APINAME.EventBlock, follow: null },
    { apiName: APINAME.EventFetch, follow: null },
    { apiName: APINAME.EventCancel, follow: null },
    { apiName: APINAME.LocalTransaction, follow: null },
    {
      apiName: APINAME.EncryptedTransaction,
      follow: [
        {
          time: 3e3,
          task: function (e, t) {
            this._runWithRetry(e, t);
          },
        },
      ],
    },
  ],
  API = (function () {
    function a(e, t) {
      var n = this;
      _classCallCheck(this, a),
        (this.mychain = e.mychain || {}),
        (this.tx_querytime = e.tx_querytime),
        (this.tx_querycount = e.tx_querycount),
        (this.tx_queryerr = 404),
        (this.power = e.power),
        this.power.setSender(_objectSpread({}, e), this.getBaseData(), t),
        apiList.forEach(function (e) {
          n.setApi(e);
        });
    }
    return (
      _createClass(a, [
        {
          key: "_runWithRetry",
          value: function (i, o) {
            var e = this,
              r = this.tx_queryerr,
              l = this.tx_querycount || 3,
              u = this.tx_querytime || 3e3;
            !(function a() {
              e.QueryTransactionReceipt({ hash: i.hash }, function (e, t, n) {
                t && t.return_code === r && 0 < l
                  ? setTimeout(function () {
                      a(), l--;
                    }, u)
                  : o(e, _objectSpread({}, t, { txhash: i.hash }), n);
              });
            })();
          },
        },
        {
          key: "getBaseData",
          value: function () {
            return {
              userPublicKey: this.mychain.userPublicKey,
              nonce: this.mychain.nonce,
              userPrivateKey: this.mychain.userPrivateKey,
              userSignature: this.mychain.userSignature,
              userRecoverPrivateKey: this.mychain.userRecoverPrivateKey,
            };
          },
        },
        {
          key: "setApi",
          value: function (e) {
            var i = this,
              t = e.apiName,
              o = e.follow,
              n = e.alias || t,
              r = this.power.makeSenderFunc(t);
            this[n] = function (e, a) {
              var t = i.getBaseData();
              r(e, t, function (e, t, n) {
                Array.isArray(o) && !e
                  ? i._followRun(t, n, a, e, o)
                  : "function" == typeof a && a(e, t, n);
              });
            };
          },
        },
        {
          key: "callApi",
          value: function (e, t, n) {
            if ("function" != typeof this[e]) throw Errors.api(e);
            return this[e](t, n);
          },
        },
        {
          key: "_followRun",
          value: function (e, t, n, o, r) {
            var l = this,
              u = 0;
            !(function a(e, t, i) {
              var n = r[u];
              n
                ? setTimeout(function () {
                    n.task.call(l, e, function (e, t, n) {
                      e
                        ? "function" == typeof i && i(e, t, n)
                        : (u++, a(t, n, i));
                    });
                  }, l.tx_querytime || n.time)
                : "function" == typeof i && i(o, e, t);
            })(e, t, n);
          },
        },
        {
          key: "contract",
          value: function (e, t, n, a) {
            return (
              Util.isFunction(n) && ((a = n), (n = null)),
              new Contract({
                client: this,
                event: this.mychain.event,
                contractName: e,
                abi: t,
                vmType: n,
                callback: a,
              })
            );
          },
        },
      ]),
      a
    );
  })();
module.exports = API;
