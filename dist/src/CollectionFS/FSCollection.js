'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  var Meteor = this;
  var collectionName = 'cfs.' + name + '.filerecord';

  return {
    find: function find(selector, options) {
      var elems = (0, _Collection2.default)(collectionName).find(selector, options);
      return elems.map(function (elem) {
        return (0, _setProperties2.default)(name, elem);
      });
    },
    findOne: function findOne(selector, options) {
      var elem = (0, _Collection2.default)(collectionName).findOne(selector, options);
      return elem && (0, _setProperties2.default)(name, elem);
    },

    insert: function insert() {
      _Collection2.default.apply(Meteor, [collectionName]).insert.apply(Meteor, arguments);
    },
    update: function update() {
      _Collection2.default.apply(Meteor, [collectionName]).update.apply(Meteor, arguments);
    },
    remove: function remove() {
      _Collection2.default.apply(Meteor, [collectionName]).remove.apply(Meteor, arguments);
    }
  };
};

var _ejson = require('ejson');

var _ejson2 = _interopRequireDefault(_ejson);

var _Collection = require('../Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _setProperties = require('./setProperties');

var _setProperties2 = _interopRequireDefault(_setProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_ejson2.default._getTypes()['FS.File']) {
  _ejson2.default.addType('FS.File', function (value) {
    return {
      getFileRecord: function getFileRecord() {
        var collection = _Data2.default.db['cfs.' + value.collectionName + '.filerecord'];

        var item = collection && collection.get(value._id);

        if (!item) return value;

        return (0, _setProperties2.default)(value.collectionName, item);
      }
    };
  });
}