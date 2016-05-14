'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Container helper using react-meteor-data.
                                                                                                                                                                                                                                                                   */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Mixin = require('./Mixin');

var _Mixin2 = _interopRequireDefault(_Mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createContainer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var Component = arguments[1];

  var expandedOptions = options;
  if (typeof options === 'function') {
    expandedOptions = {
      getMeteorData: options
    };
  }

  var _expandedOptions = expandedOptions;
  var _getMeteorData = _expandedOptions.getMeteorData;


  return _react2.default.createClass({
    displayName: 'MeteorDataContainer',
    mixins: [_Mixin2.default],
    getMeteorData: function getMeteorData() {
      return _getMeteorData(this.props);
    },
    render: function render() {
      return _react2.default.createElement(Component, _extends({}, this.props, this.data));
    }
  });
}
exports.default = createContainer;