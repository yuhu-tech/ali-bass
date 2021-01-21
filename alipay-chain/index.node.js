"use strict";
var Util = require("@alipay/mychain/build/ant3/util"),
  MyChain = require("./ant3/index"),
  Nodejs = require("./ant3/nodejs"),
  chain = function (n, e) {
    var i = new MyChain(
      n,
      function (n) {
        "function" == typeof e && e(n, i);
      },
      new Nodejs()
    );
    return i;
  };
(chain.utils = Util), (module.exports = chain);
