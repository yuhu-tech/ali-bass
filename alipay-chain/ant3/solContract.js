"use strict";
function _typeof(t) {
  return (_typeof =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(t, r.key, r);
  }
}
function _createClass(t, e, n) {
  return (
    e && _defineProperties(t.prototype, e), n && _defineProperties(t, n), t
  );
}
function _possibleConstructorReturn(t, e) {
  return !e || ("object" !== _typeof(e) && "function" != typeof e)
    ? _assertThisInitialized(t)
    : e;
}
function _assertThisInitialized(t) {
  if (void 0 === t)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return t;
}
function _getPrototypeOf(t) {
  return (_getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e)
    throw new TypeError("Super expression must either be null or a function");
  (t.prototype = Object.create(e && e.prototype, {
    constructor: { value: t, writable: !0, configurable: !0 },
  })),
    e && _setPrototypeOf(t, e);
}
function _setPrototypeOf(t, e) {
  return (_setPrototypeOf =
    Object.setPrototypeOf ||
    function (t, e) {
      return (t.__proto__ = e), t;
    })(t, e);
}
var coder = require("@alipay/mychain/build/ant3/solidity/coder"),
  Util = require("@alipay/mychain/build/ant3/util"),
  Errors = require("@alipay/mychain/build/ant3/errors"),
  BaseContract = require("@alipay/mychain/build/ant3/baseContract"),
  Sol = (function (t) {
    function i(t) {
      var e,
        n = t.contract,
        r = t.contractName,
        a = t.abi;
      return (
        _classCallCheck(this, i),
        ((e = _possibleConstructorReturn(
          this,
          _getPrototypeOf(i).call(this, {
            contract: n,
            contractName: r,
            abi: a,
          })
        )).eventTopicMap = {}),
        (e.eventMap = {}),
        e._makeContract(),
        e
      );
    }
    return (
      _inherits(i, BaseContract),
      _createClass(i, [
        {
          key: "newInput",
          value: function (t, e) {
            var n = this.abi,
              r = "";
            if (Util.isArray(e))
              for (var a = 0; a < n.length; a++) {
                var i = n[a];
                if ("constructor" === i.type) {
                  var o = [];
                  Util.isArray(i.inputs) && (o = i.inputs);
                  var u = o.map(function (t) {
                    return t.type;
                  });
                  try {
                    r += this.unpackInput(e, u);
                  } catch (t) {
                    console.error(t);
                  }
                }
              }
            return 0 === t.indexOf("0x") && (t = t.slice(2)), "0x01" + t + r;
          },
        },
        {
          key: "doPayload",
          value: function (t) {
            "function" === t.type
              ? this._sendTransaction(t)
              : "event" === t.type && this._addEvent(t);
          },
        },
        {
          key: "unpackApiOutput",
          value: function (t, e) {
            var n = e.outputTypes;
            return this._unpackOutput(t, n);
          },
        },
        {
          key: "unpackEventOutput",
          value: function (t, e) {
            var n = e.inputTypes;
            return this._unpackOutput(t, n);
          },
        },
        {
          key: "formatRequireOutput",
          value: function (t) {
            if (t) {
              t = 10 <= t.length ? t.slice(10) : t;
              var e = coder.decodeParams(["string"], t);
              return 1 === e.length ? e[0] : e;
            }
          },
        },
        {
          key: "formatLog",
          value: function (t) {
            var e = t.receipt.log_entry;
            if (Util.isArray(e))
              for (var n = 0; n < e.length; n++) {
                var r = e[n] || {},
                  a = r.topics;
                if (r.log_data && Util.isArray(a))
                  for (var i = 0; i < a.length; i++) {
                    var o = a[i];
                    if (o && this.eventTopicMap[o]) {
                      try {
                        r.log_data = this._unpackOutput(
                          r.log_data,
                          this.eventTopicMap[o].inputTypes
                        );
                      } catch (t) {
                        console.error(t);
                      }
                      r.log_name = this.eventTopicMap[o].name;
                    }
                  }
              }
            return t;
          },
        },
        {
          key: "eventFilterArr",
          value: function (t) {
            var e = t.args,
              n = t.inputNames,
              r = [];
            if (0 < e.length) {
              var a = (e[0] || {}).filter || null;
              if (a)
                for (var i = 0; i < n.length; i++) {
                  var o = n[i];
                  r.push(a[o] || null);
                }
            }
            return r;
          },
        },
        {
          key: "getOutput",
          value: function (t, e) {
            for (var n = [], r = this.abi, a = 0; a < r.length; a++) {
              var i = r[a];
              if (i.name === t) {
                var o = [];
                Util.isArray(i.outputs) && (o = i.outputs),
                  (n = o.map(function (t) {
                    return t.type;
                  }));
                break;
              }
            }
            return this._unpackOutput(e, n);
          },
        },
        {
          key: "toPayload",
          value: function (t, e, n) {
            var r = {};
            return (
              t.length > n.length &&
                Util.isObject(t[t.length - 1]) &&
                (r = t[t.length - 1]),
              (r.data = e + this.unpackInput(t, n)),
              r
            );
          },
        },
        {
          key: "unpackInput",
          value: function (t, e) {
            return this.validateArgs(t, e), coder.encodeParams(e, t);
          },
        },
        {
          key: "validateArgs",
          value: function (t, e) {
            if (
              t.filter(function (t) {
                return !(
                  !0 === Util.isObject(t) &&
                  !1 === Util.isArray(t) &&
                  !1 === Util.isBigNumber(t)
                );
              }).length !== e.length
            )
              throw Errors.InvalidNumberOfSolidityArgs();
          },
        },
        {
          key: "extractCallback",
          value: function (t) {
            if (Util.isFunction(t[t.length - 1])) return t.pop();
          },
        },
        {
          key: "_unpackOutput",
          value: function (t, e) {
            if (t) {
              t = 2 <= t.length ? t.slice(2) : t;
              var n = coder.decodeParams(e, t);
              return 1 === n.length ? n[0] : n;
            }
          },
        },
        {
          key: "_makeContract",
          value: function () {
            for (var t = this.abi, e = 0; e < t.length; e++) {
              var n = t[e],
                r = [];
              Util.isArray(n.inputs) && (r = n.inputs);
              var a = [];
              Util.isArray(n.outputs) && (a = n.outputs);
              for (var i = [], o = [], u = 0; u < r.length; u++) {
                var s = r[u];
                i.push(s.type), o.push(s.name);
              }
              var c = a.map(function (t) {
                return t.type;
              });
              "function" === n.type
                ? this._setFunction(n, i, c)
                : "event" === n.type && this._setEvent(n, i, c, o);
            }
          },
        },
        {
          key: "_setThisFunc",
          value: function (t, e, n, r) {
            this.contract[t] || (this.contract[t] = r),
              this.contract[e] || (this.contract[e] = r),
              (this.contract[t][n] = r),
              (this.contract[e][n] = r);
          },
        },
        {
          key: "_setFunction",
          value: function (t, e, n) {
            var r = Util.transformToFullName(t, e),
              a = "0x" + Util.sha3(r).slice(0, 8),
              i = Util.extractDisplayName(r),
              o = Util.extractTypeName(r),
              u = this;
            this._setThisFunc(i, a, o, function () {
              var timestamp = arguments[0],
                isMakeHash = arguments[1],
                t = Array.prototype.slice.call(arguments, 2);
              u.contract.callApi({
                type: "function",
                args: t,
                signName: a,
                inputTypes: e,
                outputTypes: n,
                timestamp: timestamp,
                isMakeHash: isMakeHash,
              });
            });
          },
        },
        {
          key: "_sendTransaction",
          value: function (t) {
            var e = t.args,
              n = t.signName,
              r = t.inputTypes,
              a = (t.outputTypes, this.extractCallback(e)),
              i = null,
              o = null;
            try {
              i = this.toPayload(e, n, r);
            } catch (t) {
              o = t;
            }
            this.contract.sendTransaction(o, i, a, t);
          },
        },
        {
          key: "_setEvent",
          value: function (t, e, n, r) {
            var a = Util.transformToFullName(t, e),
              i = Util.extractDisplayName(a),
              o = Util.extractTypeName(a),
              u = Util.sha3(a),
              s = "0x" + u.slice(0, 8),
              c = { name: a, inputTypes: e, sha3Name: u };
            this.eventTopicMap[u] = c;
            var l = this;
            this._setThisFunc(i, s, o, function () {
              var t = Array.prototype.slice.call(arguments);
              l.contract.callApi({
                type: "event",
                args: t,
                sha3Name: u,
                signName: s,
                inputTypes: e,
                outputTypes: n,
                inputNames: r,
              });
            });
          },
        },
        {
          key: "_addEvent",
          value: function (r) {
            var a = this,
              t = r.args,
              e = r.sha3Name,
              i =
                (r.signName,
                r.inputTypes,
                r.outputTypes,
                r.inputNames,
                this.extractCallback(t));
            this.eventMap[e] ||
              (this.eventMap[e] = this.event.topic(
                { to: e },
                function (t, e, n) {
                  t && console.error(t);
                }
              )),
              this.eventMap[e].on(function (t, e, n) {
                a.contract.callEvent(t, e, i, r);
              });
          },
        },
      ]),
      i
    );
  })();
module.exports = Sol;
