'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  var Meteor = this;
  if (!_Data2.default.db[name]) {
    _Data2.default.db.addCollection(name);
  }

  return {
    find: function find(selector, options) {
      if (typeof selector == 'string') {
        if (options) {
          return [_Data2.default.db[name].findOne({ _id: selector }, options)];
        } else {
          return [_Data2.default.db[name].get(selector)];
        }
      }
      return _Data2.default.db[name].find(selector, options);
    },
    findOne: function findOne(selector, options) {

      if (typeof selector == 'string') {
        if (options) {
          return _Data2.default.db[name].findOne({ _id: selector }, options);
        } else {
          return _Data2.default.db[name].get(selector);
        }
      }
      return _Data2.default.db[name] && _Data2.default.db[name].findOne(selector, options);
    },
    insert: function insert(item) {
      var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];


      var id = void 0;

      if ('_id' in item) {
        if (!item._id || typeof item._id != 'string') {
          return callback("Meteor requires document _id fields to be non-empty strings");
        }
        id = item._id;
      } else {
        id = item._id = _Random2.default.id();
      }

      if (_Data2.default.db[name].get(id)) return callback({ error: 409, reason: "Duplicate key _id with value " + id });

      _Data2.default.db[name].upsert(item);

      Meteor.waitDdpConnected(function () {
        Meteor.call('/' + name + '/insert', item, function (err) {
          if (err) {
            _Data2.default.db[name].del(id);
            return callback(err);
          }

          callback(null, id);
        });
      });

      return id;
    },
    update: function update(id, modifier) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var callback = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];


      if (typeof options == 'function') {
        callback = options;
        options = {};
      }

      if (!_Data2.default.db[name].get(id)) return callback({ error: 409, reason: "Item not found in collection " + name + " with id " + id });

      Meteor.waitDdpConnected(function () {
        Meteor.call('/' + name + '/update', { _id: id }, modifier, function (err) {
          if (err) {
            return callback(err);
          }

          callback(null, id);
        });
      });
    },
    remove: function remove(id) {
      var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];


      var element = this.findOne(id);
      if (element) {
        _Data2.default.db[name].del(element._id);

        Meteor.waitDdpConnected(function () {
          Meteor.call('/' + name + '/remove', { _id: id }, function (err, res) {
            if (err) {
              _Data2.default.db[name].upsert(element);
              return callback(err);
            }
            callback(null, res);
          });
        });
      } else {
        callback('No document with _id : ' + id);
      }
    }
  };
};

var _Data = require('./Data');

var _Data2 = _interopRequireDefault(_Data);

var _Random = require('../lib/Random');

var _Random2 = _interopRequireDefault(_Random);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }