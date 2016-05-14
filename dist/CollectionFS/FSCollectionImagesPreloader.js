'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _setProperties = require('./setProperties');

var _setProperties2 = _interopRequireDefault(_setProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FSCollectionImagesPreloader = function (_Component) {
  _inherits(FSCollectionImagesPreloader, _Component);

  function FSCollectionImagesPreloader(props) {
    _classCallCheck(this, FSCollectionImagesPreloader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FSCollectionImagesPreloader).call(this, props));

    _this.state = {
      items: []
    };
    return _this;
  }

  _createClass(FSCollectionImagesPreloader, [{
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


      return _reactNative2.default.createElement(
        _reactNative.View,
        { style: styles.hidden },
        items && items.map(function (item) {
          return _reactNative2.default.createElement(_reactNative.Image, { style: styles.hidden, key: item._id, source: { uri: item.url() } });
        })
      );
    }
  }]);

  return FSCollectionImagesPreloader;
}(_reactNative.Component);

FSCollectionImagesPreloader.propTypes = {
  collection: _reactNative.PropTypes.string.isRequired,
  selector: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.string, _reactNative.PropTypes.object])
};
FSCollectionImagesPreloader.defaultProps = {
  selector: {}
};
exports.default = FSCollectionImagesPreloader;


var styles = _reactNative.StyleSheet.create({
  hidden: {
    width: 1,
    height: 1,
    position: 'absolute',
    top: -100000,
    left: -10000,
    opacity: 0
  }
});