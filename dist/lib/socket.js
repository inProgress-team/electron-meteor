"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _wolfy87Eventemitter = require("wolfy87-eventemitter");

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _ejson = require("ejson");

var _ejson2 = _interopRequireDefault(_ejson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Socket = function (_EventEmitter) {
    (0, _inherits3.default)(Socket, _EventEmitter);

    function Socket(SocketConstructor, endpoint) {
        (0, _classCallCheck3.default)(this, Socket);

        var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(Socket).call(this));

        _this.SocketConstructor = SocketConstructor;
        _this.endpoint = endpoint;
        _this.rawSocket = null;
        return _this;
    }

    (0, _createClass3.default)(Socket, [{
        key: "send",
        value: function send(object) {
            var message = _ejson2.default.stringify(object);
            this.rawSocket.send(message);
            // Emit a copy of the object, as the listener might mutate it.
            this.emit("message:out", _ejson2.default.parse(message));
        }
    }, {
        key: "open",
        value: function open() {
            var _this2 = this;

            /*
            *   Makes `open` a no-op if there's already a `rawSocket`. This avoids
            *   memory / socket leaks if `open` is called twice (e.g. by a user
            *   calling `ddp.connect` twice) without properly disposing of the
            *   socket connection. `rawSocket` gets automatically set to `null` only
            *   when it goes into a closed or error state. This way `rawSocket` is
            *   disposed of correctly: the socket connection is closed, and the
            *   object can be garbage collected.
            */
            if (this.rawSocket) {
                return;
            }
            this.rawSocket = new this.SocketConstructor(this.endpoint);

            /*
            *   Calls to `onopen` and `onclose` directly trigger the `open` and
            *   `close` events on the `Socket` instance.
            */
            this.rawSocket.onopen = function () {
                return _this2.emit("open");
            };
            this.rawSocket.onclose = function () {
                _this2.rawSocket = null;
                _this2.emit("close");
            };
            /*
            *   Calls to `onerror` trigger the `close` event on the `Socket`
            *   instance, and cause the `rawSocket` object to be disposed of.
            *   Since it's not clear what conditions could cause the error and if
            *   it's possible to recover from it, we prefer to always close the
            *   connection (if it isn't already) and dispose of the socket object.
            */
            this.rawSocket.onerror = function () {
                // It's not clear what the socket lifecycle is when errors occurr.
                // Hence, to avoid the `close` event to be emitted twice, before
                // manually closing the socket we de-register the `onclose`
                // callback.
                delete _this2.rawSocket.onclose;
                // Safe to perform even if the socket is already closed
                _this2.rawSocket.close();
                _this2.rawSocket = null;
                _this2.emit("close");
            };
            /*
            *   Calls to `onmessage` trigger a `message:in` event on the `Socket`
            *   instance only once the message (first parameter to `onmessage`) has
            *   been successfully parsed into a javascript object.
            */
            this.rawSocket.onmessage = function (message) {
                var object;
                try {
                    object = _ejson2.default.parse(message.data);
                } catch (ignore) {
                    // Simply ignore the malformed message and return
                    return;
                }
                // Outside the try-catch block as it must only catch JSON parsing
                // errors, not errors that may occur inside a "message:in" event
                // handler
                _this2.emit("message:in", object);
            };
        }
    }, {
        key: "close",
        value: function close() {
            /*
            *   Avoid throwing an error if `rawSocket === null`
            */
            if (this.rawSocket) {
                this.rawSocket.close();
            }
        }
    }]);
    return Socket;
}(_wolfy87Eventemitter2.default);

exports.default = Socket;