'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _minimongoCache = require('minimongo-cache');

var _minimongoCache2 = _interopRequireDefault(_minimongoCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.nextTick = setImmediate;

var db = new _minimongoCache2.default();
db.debug = false;
db.batchedUpdates = _reactNative2.default.addons.batchedUpdates;

exports.default = {
  _endpoint: null,
  _options: null,
  ddp: null,
  subscriptions: {},
  db: db,
  calls: [],

  getUrl: function getUrl() {
    return this._endpoint.substring(0, this._endpoint.indexOf('/websocket'));
  },
  waitDdpReady: function waitDdpReady(cb) {
    var _this = this;

    if (this.ddp) {
      cb();
    } else {
      setTimeout(function () {
        _this.waitDdpReady(cb);
      }, 10);
    }
  },


  _cbs: [],
  onChange: function onChange(cb) {
    this.db.on('change', cb);
    this.ddp.on('connected', cb);
    this.ddp.on('disconnected', cb);
    this.on('loggingIn', cb);
    this.on('change', cb);
  },
  offChange: function offChange(cb) {
    this.db.off('change', cb);
    this.ddp.off('connected', cb);
    this.ddp.off('disconnected', cb);
    this.off('loggingIn', cb);
    this.off('change', cb);
  },
  on: function on(eventName, cb) {
    this._cbs.push({
      eventName: eventName,
      callback: cb
    });
  },
  off: function off(eventName, cb) {
    this._cbs.splice(this._cbs.findIndex(function (_cb) {
      return _cb.callback == cb && _cb.eventName == eventName;
    }), 1);
  },
  notify: function notify(eventName) {
    this._cbs.map(function (cb) {
      if (cb.eventName == eventName && typeof cb.callback == 'function') {
        cb.callback();
      }
    });
  }
};