'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _base = require('base-64');

var _base2 = _interopRequireDefault(_base);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name, file) {
  var getStoreName = function getStoreName() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? { store: name } : arguments[0];

    return params.store;
  };
  var getImageInfos = function getImageInfos(params) {
    if (!params || !params.store) return file.original || {};
    return file.copies[params.store] || {};
  };
  var getType = function getType(params) {
    return getImageInfos(params).type;
  };
  return (0, _extends3.default)({}, file, {
    url: function url(params) {
      var token = _Data2.default._tokenIdSaved;
      var fileName = getImageInfos(params).name;
      return _Data2.default.getUrl().replace('ws://', 'http://').replace('wss://', 'https://') + '/cfs/files/' + name + '/' + file._id + '/' + fileName + '?store=' + getStoreName(params) + (token ? '&token=' + _base2.default.encode(JSON.stringify({ authToken: token })) : "");
    },
    isImage: function isImage(params) {
      var type = getType(params);
      return type && type.indexOf('image/') === 0;
    },
    isAudio: function isAudio(params) {
      var type = getType(params);
      return type && type.indexOf('audio/') === 0;
    },
    isVideo: function isVideo(params) {
      var type = getType(params);
      return type && type.indexOf('video/') === 0;
    },
    isUploaded: function isUploaded(params) {
      return !!getImageInfos(params).updatedAt;
    },
    name: function name(params) {
      return getImageInfos(params).name;
    },
    extension: function extension(params) {
      var imageName = getImageInfos(params).name;
      if (!imageName) return;
      return imageName.substring(imageName.lastIndexOf('.') + 1);
    },
    size: function size(params) {
      return getImageInfos(params).size;
    },
    type: getType,
    updatedAt: function updatedAt(params) {
      return getImageInfos(params).updatedAt;
    }
  });
};