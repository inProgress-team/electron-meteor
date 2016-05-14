"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (eventName) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (args.length && typeof args[args.length - 1] === "function") {
    var callback = args.pop();
  }

  var id = _Data2.default.ddp.method(eventName, args);
  _Data2.default.calls.push({
    id: id,
    callback: callback
  });
};

var _Data = require("./Data");

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }