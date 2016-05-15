"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqueId = uniqueId;
exports.contains = contains;
exports.hashPassword = hashPassword;

var _sha = require("crypto-js/sha256");

var _sha2 = _interopRequireDefault(_sha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i = 0;
function uniqueId() {
  return (i++).toString();
}

function contains(array, element) {
  return array.indexOf(element) !== -1;
}

function hashPassword(password) {
  return {
    digest: (0, _sha2.default)(password).toString(),
    algorithm: "sha-256"
  };
}