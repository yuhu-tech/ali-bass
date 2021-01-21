"use strict";
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function _createClass(e, t, n) {
  return (
    t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
  );
}
var httpMethod = require("@alipay/mychain/build/ant3/config/httpMethod"),
  ApiParamFormat = require("@alipay/mychain/build/ant3/config/apiParamFormat"),
  Request = require("@alipay/mychain/build/ant3/request"),
  httpOutput = ApiParamFormat.httpOutput,
  Webjs = (function () {
    function e() {
      _classCallCheck(this, e), (this.version = "0.10"), (this.sender = null);
    }
    return (
      _createClass(e, [
        {
          key: "makeSenderFunc",
          value: function (a) {
            var o = this;
            return function (e, t, n, h) {
              t.transaction_type = ApiParamFormat[a].transaction_type;
              var r = {},
                i = ApiParamFormat[a];
              i &&
                "function" == typeof i.httpInput &&
                (r = i.httpInput(a, e, t)),
                h && "function" == typeof h && h(r.hash),
                o._send(
                  e.version || o.version,
                  httpMethod[a] || "",
                  r,
                  function (e, t) {
                    "function" == typeof n && n(e, httpOutput(a, t));
                  }
                );
            };
          },
        },
        {
          key: "_send",
          value: function (e, t, n, r) {
            var i = { version: e, method: t, params: n };
            this.send(i, r);
          },
        },
        {
          key: "send",
          value: function (e, t) {
            this.sender.send(e, t);
          },
        },
        {
          key: "setSender",
          value: function (e, t, n) {
            var r = this;
            return (
              (this.sender = new Request(e)),
              "function" == typeof n &&
                setTimeout(function () {
                  n(null, r.sender);
                }, 1),
              this.sender
            );
          },
        },
      ]),
      e
    );
  })();
module.exports = Webjs;
