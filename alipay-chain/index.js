"use strict";
var Util = require("@alipay/mychain/build/ant3/util"),
  MyChain = require("./ant3/index"),
  Webjs = require("./ant3/web"),
  chain = function (n, e) {
    var i = new MyChain(
      n,
      function (n) {
        "function" == typeof e && e(n, i);
      },
      new Webjs()
    );
    return i;
  };
(chain.utils = Util), (module.exports = chain);
