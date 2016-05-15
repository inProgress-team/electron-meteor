'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _setProperties = require('./setProperties');

var _setProperties2 = _interopRequireDefault(_setProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FSCollectionImagesPreloader = function (_Component) {
  (0, _inherits3.default)(FSCollectionImagesPreloader, _Component);

  function FSCollectionImagesPreloader(props) {
    (0, _classCallCheck3.default)(this, FSCollectionImagesPreloader);

    var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(FSCollectionImagesPreloader).call(this, props));

    _this.state = {
      items: []
    };
    return _this;
  }

  (0, _createClass3.default)(FSCollectionImagesPreloader, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var _props = this.props;
      var collection = _props.collection;
      var selector = _props.selector;


      this.update = function (results) {
        _this2.setState({
          items: results.map(function (elem) {
            return (0, _setProperties2.default)(collection, elem);
          })
        });
      };

      var collectionName = 'cfs.' + collection + '.filerecord';

      if (!_Data2.default.db[collectionName]) {
        _Data2.default.db.addCollection(collectionName);
      }

      this.items = _Data2.default.db.observe(function () {
        return _Data2.default.db[collectionName].find(selector);
      });

      this.items.subscribe(this.update);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.items.dispose();
    }
  }, {
    key: 'render',
    value: function render() {
      var items = this.state.items;


      return _react2.default.createElement('img', { src: item.url(), style: { width: 1, height: 1, position: 'absolute', top: '-5000px', left: '-5000px' } });
    }
  }]);
  return FSCollectionImagesPreloader;
}(_react.Component);

FSCollectionImagesPreloader.propTypes = {
  collection: _react.PropTypes.string.isRequired,
  selector: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object])
};
FSCollectionImagesPreloader.defaultProps = {
  selector: {}
};
exports.default = FSCollectionImagesPreloader;