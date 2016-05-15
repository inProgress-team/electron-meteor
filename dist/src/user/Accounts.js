'use strict';

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _Call = require('../Call');

var _Call2 = _interopRequireDefault(_Call);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _utils = require('../../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  createUser: function createUser(options) {
    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    if (options.username) options.username = options.username;
    if (options.email) options.email = options.email;

    // Replace password with the hashed password.
    options.password = (0, _utils.hashPassword)(options.password);

    _User2.default._startLoggingIn();
    (0, _Call2.default)("createUser", options, function (err, result) {
      _User2.default._endLoggingIn();

      _User2.default._handleLoginCallback(err, result);

      callback(err);
    });
  },
  changePassword: function changePassword(oldPassword, newPassword) {
    var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];


    //TODO check Meteor.user() to prevent if not logged

    if (typeof newPassword != 'string' || !newPassword) {
      return callback("Password may not be empty");
    }

    (0, _Call2.default)("changePassword", oldPassword ? (0, _utils.hashPassword)(oldPassword) : null, (0, _utils.hashPassword)(newPassword), function (err, res) {

      callback(err);
    });
  },
  forgotPassword: function forgotPassword(options) {
    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    if (!options.email) {
      return callback("Must pass options.email");
    }

    (0, _Call2.default)("forgotPassword", options, function (err) {
      callback(err);
    });
  },
  onLogin: function onLogin(cb) {
    _Data2.default.on('onLogin', cb);
  },
  onLoginFailure: function onLoginFailure(cb) {
    _Data2.default.on('onLoginFailure', cb);
  }
};