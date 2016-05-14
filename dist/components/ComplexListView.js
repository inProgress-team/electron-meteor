'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeteorListView = function (_Component) {
  _inherits(MeteorListView, _Component);

  function MeteorListView(props) {
    _classCallCheck(this, MeteorListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MeteorListView).call(this, props));

    _this.state = {
      ds: new _reactNative.ListView.DataSource({
        rowHasChanged: function rowHasChanged(row1, row2) {
          return row1 !== row2;
        }
      })
    };
    return _this;
  }

  _createClass(MeteorListView, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var elements = props.elements;


      var elems = elements();
      this.setState({
        ds: this.state.ds.cloneWithRows(elems)
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var elements = this.props.elements;


      this.onChange = function () {
        var elems = elements();
        _this2.setState({
          ds: _this2.state.ds.cloneWithRows(elems)
        });
      };

      this.onChange();
      _Data2.default.onChange(this.onChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _Data2.default.offChange(this.onChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var ds = this.state.ds;
      var _props = this.props;
      var listViewRef = _props.listViewRef;

      var props = _objectWithoutProperties(_props, ['listViewRef']);

      return _reactNative2.default.createElement(_reactNative.ListView, _extends({}, props, {
        ref: listViewRef,
        dataSource: ds
      }));
    }
  }]);

  return MeteorListView;
}(_reactNative.Component);

MeteorListView.propTypes = {
  elements: _reactNative.PropTypes.func.isRequired,
  renderRow: _reactNative.PropTypes.func.isRequired,
  listViewRef: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.func, _reactNative.PropTypes.string])
};
exports.default = MeteorListView;