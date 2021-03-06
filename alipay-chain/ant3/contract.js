"use strict";
function _objectSpread(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = null != arguments[t] ? arguments[t] : {},
      n = Object.keys(r);
    "function" == typeof Object.getOwnPropertySymbols &&
      (n = n.concat(
        Object.getOwnPropertySymbols(r).filter(function (t) {
          return Object.getOwnPropertyDescriptor(r, t).enumerable;
        })
      )),
      n.forEach(function (t) {
        _defineProperty(e, t, r[t]);
      });
  }
  return e;
}
function _defineProperty(t, e, r) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = r),
    t
  );
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(t, e) {
  for (var r = 0; r < e.length; r++) {
    var n = e[r];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(t, n.key, n);
  }
}
function _createClass(t, e, r) {
  return (
    e && _defineProperties(t.prototype, e), r && _defineProperties(t, r), t
  );
}
var Util = require("@alipay/mychain/build/ant3/util"),
  Errors = require("@alipay/mychain/build/ant3/errors"),
  ApiName = require("@alipay/mychain/build/ant3/config/apiName"),
  ApiParamFormat = require("./config/apiParamFormat"),
  VmType = require("@alipay/mychain/build/ant3/config/vmType"),
  SolContract = require("./solContract"),
  WasmContract = require("@alipay/mychain/build/ant3/wasmContract");
function paramCheck(t, e) {
  if (t)
    if ((Util.isBigNumber(e) && (e = Util.toDecimal(e)), Array.isArray(t))) {
      if (-1 === t.indexOf(e)) return !1;
    } else if (e !== t) return !1;
  return !0;
}
function eventFilterCheck(t, e) {
  if (!Array.isArray(t)) return paramCheck(e[0], t);
  for (var r = 0; r < t.length; r++) {
    var n = t[r],
      a = paramCheck(e[r], n);
    if (!a) return a;
  }
  return !0;
}
var Contract = (function () {
  function u(t) {
    var e = this,
      r = t.client,
      n = t.event,
      a = t.contractName,
      c = t.abi,
      i = t.vmType,
      l = t.callback;
    if ((_classCallCheck(this, u), !a))
      throw new Error("ERROR: The contractName is null");
    (this.client = r),
      (this.event = n),
      (this.contractName = a),
      (this.abi = c || []),
      (this.vmType = i || VmType.EVM),
      (this.deploy_type = 0),
      (this.callCache = []);
    var o = SolContract;
    switch (this.vmType) {
      case VmType.EVM:
        o = SolContract;
        break;
      case VmType.WASM:
        o = WasmContract;
    }
    (this.contractTpl = new o({
      contract: this,
      contractName: a,
      abi: this.abi,
    })),
      setTimeout(function () {
        "function" == typeof l && l(err, e);
      }, 1);
  }
  return (
    _createClass(u, [
      {
        key: "callbackRun",
        value: function (t, e, r, n) {
          (this.deploy_type = e ? 2 : 0), "function" == typeof t && t(e, r, n);
        },
      },
      {
        key: "new",
        value: function (t) {
          var n = this,
            timestamp = 1 < arguments.length ? arguments[1] : void 0,
            isMakeHash = 2 < arguments.length ? arguments[2] : void 0,
            e =
              3 < arguments.length && void 0 !== arguments[3]
                ? arguments[3]
                : {},
            a = 4 < arguments.length ? arguments[4] : void 0,
            r = "";
          try {
            (r = this.contractTpl.newInput(t, e.parameters)),
              (e.parameters = null),
              delete e.parameters;
          } catch (t) {
            return this.callbackRun(a, t, this, null), this;
          }
          this.deploy_type = 1;
          var c = _objectSpread({}, e);
          (c.from = e.from),
            (c.to = this.contractName),
            (c.data = { code: r }),
            (c.timestamp = timestamp);
          var i = this.client.DeployContract;
          if (isMakeHash) {
            var deployApiName = ApiName.DeployContract;
            var deployApiParam = ApiParamFormat[deployApiName];
            var baseData = this.client.getBaseData();
            baseData.transaction_type = deployApiParam.transaction_type;
            var transaction = {};
            deployApiParam &&
              "function" == typeof deployApiParam.nodeInput &&
              (transaction = deployApiParam.nodeInput(
                deployApiName,
                c,
                baseData
              ));
            return a(null, null, transaction), this;
          } else {
            return (
              c.encrypt &&
                ((i = this.client.EncryptedTransaction),
                (c.apiName = "DeployContract")),
              c.local &&
                ((i = this.client.LocalTransaction),
                (c.apiName = "DeployContract")),
              i.call(this.client, c, function (t, e) {
                if (t) n.callbackRun(a, t, n, e);
                else if (0 === e.return_code)
                  if (e.receipt)
                    if (0 === e.receipt.result) {
                      if ((n.callbackRun(a, null, n, e), n.callCache.length))
                        for (var r = n.callCache.shift(); r; )
                          n.contractTpl.doPayload(r), (r = n.callCache.shift());
                      n.callCache = [];
                    } else
                      n.callbackRun(
                        a,
                        Errors.receiptResult(e.receipt.result),
                        n,
                        e
                      );
                  else n.callbackRun(a, Errors.receiptResult(null), n, e);
                else n.callbackRun(a, Errors.returnCode(e.return_code), n, e);
              }),
              this
            );
          }
        },
      },
      {
        key: "update",
        value: function (t) {
          var n = this,
            e =
              1 < arguments.length && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            a = 2 < arguments.length ? arguments[2] : void 0,
            r = "";
          try {
            r = this.contractTpl.newInput(t, null);
          } catch (t) {
            return this.callbackRun(a, t, this, null), this;
          }
          this.deploy_type = 1;
          var c = _objectSpread({}, e);
          (c.from = this.contractName),
            (c.to = this.contractName),
            (c.data = { code: r });
          var i = this.client.UpdateContract;
          return (
            c.encrypt &&
              ((i = this.client.EncryptedTransaction),
              (c.apiName = "UpdateContract")),
            c.local &&
              ((i = this.client.LocalTransaction),
              (c.apiName = "UpdateContract")),
            i.call(this.client, c, function (t, e) {
              if (t) n.callbackRun(a, t, n, e);
              else if (0 === e.return_code)
                if (e.receipt)
                  if (0 === e.receipt.result) {
                    if ((n.callbackRun(a, null, n, e), n.callCache.length))
                      for (var r = n.callCache.shift(); r; )
                        n.contractTpl.doPayload(r), (r = n.callCache.shift());
                    n.callCache = [];
                  } else
                    n.callbackRun(
                      a,
                      Errors.receiptResult(e.receipt.result),
                      n,
                      e
                    );
                else n.callbackRun(a, Errors.receiptResult(null), n, e);
              else n.callbackRun(a, Errors.returnCode(e.return_code), n, e);
            }),
            this
          );
        },
      },
      {
        key: "callApi",
        value: function (t) {
          1 === this.deploy_type
            ? this.callCache.push(t)
            : this.contractTpl.doPayload(t);
        },
      },
      {
        key: "sendTransaction",
        value: function (t) {
          var i = this,
            e =
              1 < arguments.length && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            l = 2 < arguments.length ? arguments[2] : void 0,
            o = 3 < arguments.length ? arguments[3] : void 0;
          if (2 !== this.deploy_type)
            if (t)
              Util.isFunction(l) &&
                setTimeout(function () {
                  l(t, null, null);
                }, 1);
            else {
              var r = _objectSpread({}, e, {
                  to: this.contractName,
                  data: { parameter: e.data || "" },
                }),
                n = this.client.CallContract;
              r.encrypt &&
                ((n = this.client.EncryptedTransaction),
                (r.apiName = "CallContract")),
                r.local &&
                  ((n = this.client.LocalTransaction),
                  (r.apiName = "CallContract"));
              var u = !1;
              r.encrypt && (u = !0), (r.timestamp = o.timestamp);
              if (o.isMakeHash) {
                var callApiName = ApiName.CallContract;
                var callApiParam = ApiParamFormat[callApiName];
                var baseData = this.client.getBaseData();
                baseData.transaction_type = callApiParam.transaction_type;
                var transaction = {};
                callApiParam &&
                  "function" == typeof callApiParam.nodeInput &&
                  (transaction = callApiParam.nodeInput(
                    callApiName,
                    r,
                    baseData
                  ));
                return l(null, null, transaction), this;
              } else {
                n.call(this.client, r, function (t, e, r) {
                  if (Util.isFunction(l)) {
                    if (t) return void l(t, null, e, r);
                    if (0 !== e.return_code)
                      return void l(
                        Errors.returnCode(e.return_code),
                        null,
                        e,
                        r
                      );
                    if (!e.receipt)
                      return void l(new Error("Receipt is null"), null, e, r);
                    if (10201 === e.receipt.result) {
                      var n = null;
                      try {
                        n = i.formatRequireOutput(e.receipt.output);
                      } catch (t) {
                        n = null;
                      }
                      return void l(
                        Errors.receiptResult(e.receipt.result),
                        n,
                        e,
                        r
                      );
                    }
                    if (0 !== e.receipt.result)
                      return void l(
                        Errors.receiptResult(e.receipt.result),
                        null,
                        e,
                        r
                      );
                    if (u) return void l(t, e.receipt.output, e, r);
                    e = i.formatLog(e);
                    var a = t,
                      c = null;
                    try {
                      c = i.contractTpl.unpackApiOutput(e.receipt.output, o);
                    } catch (t) {
                      a = t;
                    }
                    l(a, c, e, r);
                  }
                });
              }
            }
          else
            Util.isFunction(l) &&
              setTimeout(function () {
                l(Errors.contractDeploy(i.contractName), null, null);
              }, 1);
        },
      },
      {
        key: "callEvent",
        value: function (e, t, r, n) {
          if (Util.isFunction(r)) {
            if (e) return void r(e, t);
            var a = null;
            if (t.event_data && t.event_data.data)
              try {
                a = this.contractTpl.unpackEventOutput(t.event_data.data, n);
              } catch (t) {
                e = t;
              }
            eventFilterCheck(a, this.contractTpl.eventFilterArr(n)) &&
              r(e, a, t);
          }
        },
      },
      {
        key: "getOutput",
        value: function (t, e) {
          return this.contractTpl.getOutput(t, e);
        },
      },
      {
        key: "formatLog",
        value: function (t) {
          return this.contractTpl.formatLog(t);
        },
      },
      {
        key: "formatRequireOutput",
        value: function (t) {
          return this.contractTpl.formatRequireOutput(t);
        },
      },
    ]),
    u
  );
})();
module.exports = Contract;
