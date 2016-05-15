"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _get3 = require("babel-runtime/helpers/get");

var _get4 = _interopRequireDefault(_get3);

var _wolfy87Eventemitter = require("wolfy87-eventemitter");

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _queue = require("./queue");

var _queue2 = _interopRequireDefault(_queue);

var _socket = require("./socket");

var _socket2 = _interopRequireDefault(_socket);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* DDP.JS 2.1.0
*/

var DDP_VERSION = "1";
var PUBLIC_EVENTS = [
// Subscription messages
"ready", "nosub", "added", "changed", "removed",
// Method messages
"result", "updated",
// Error messages
"error"];
var DEFAULT_RECONNECT_INTERVAL = 10000;

var DDP = function (_EventEmitter) {
    (0, _inherits3.default)(DDP, _EventEmitter);
    (0, _createClass3.default)(DDP, [{
        key: "emit",
        value: function emit() {
            var _get2;

            setTimeout((_get2 = (0, _get4.default)(Object.getPrototypeOf(DDP.prototype), "emit", this)).bind.apply(_get2, [this].concat(Array.prototype.slice.call(arguments))), 0);
        }
    }]);

    function DDP(options) {
        (0, _classCallCheck3.default)(this, DDP);

        var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(DDP).call(this));

        _this.status = "disconnected";

        // Default `autoConnect` and `autoReconnect` to true
        _this.autoConnect = options.autoConnect !== false;
        _this.autoReconnect = options.autoReconnect !== false;
        _this.reconnectInterval = options.reconnectInterval || DEFAULT_RECONNECT_INTERVAL;

        _this.messageQueue = new _queue2.default(function (message) {
            if (_this.status === "connected") {
                _this.socket.send(message);
                return true;
            } else {
                return false;
            }
        });

        _this.socket = new _socket2.default(options.SocketConstructor, options.endpoint);

        _this.socket.on("open", function () {
            // When the socket opens, send the `connect` message
            // to establish the DDP connection
            _this.socket.send({
                msg: "connect",
                version: DDP_VERSION,
                support: [DDP_VERSION]
            });
        });

        _this.socket.on("close", function () {
            _this.status = "disconnected";
            _this.messageQueue.empty();
            _this.emit("disconnected");
            if (_this.autoReconnect) {
                // Schedule a reconnection
                setTimeout(_this.socket.open.bind(_this.socket), _this.reconnectInterval);
            }
        });

        _this.socket.on("message:in", function (message) {
            if (message.msg === "connected") {
                _this.status = "connected";
                _this.messageQueue.process();
                _this.emit("connected");
            } else if (message.msg === "ping") {
                // Reply with a `pong` message to prevent the server from
                // closing the connection
                _this.socket.send({ msg: "pong", id: message.id });
            } else if ((0, _utils.contains)(PUBLIC_EVENTS, message.msg)) {
                _this.emit(message.msg, message);
            }
        });

        if (_this.autoConnect) {
            _this.connect();
        }

        return _this;
    }

    (0, _createClass3.default)(DDP, [{
        key: "connect",
        value: function connect() {
            this.socket.open();
        }
    }, {
        key: "disconnect",
        value: function disconnect() {
            /*
            *   If `disconnect` is called, the caller likely doesn't want the
            *   the instance to try to auto-reconnect. Therefore we set the
            *   `autoReconnect` flag to false.
            */
            this.autoReconnect = false;
            this.socket.close();
        }
    }, {
        key: "method",
        value: function method(name, params) {
            var id = (0, _utils.uniqueId)();
            this.messageQueue.push({
                msg: "method",
                id: id,
                method: name,
                params: params
            });
            return id;
        }
    }, {
        key: "sub",
        value: function sub(name, params) {
            var id = (0, _utils.uniqueId)();
            this.messageQueue.push({
                msg: "sub",
                id: id,
                name: name,
                params: params
            });
            return id;
        }
    }, {
        key: "unsub",
        value: function unsub(id) {
            this.messageQueue.push({
                msg: "unsub",
                id: id
            });
            return id;
        }
    }]);
    return DDP;
}(_wolfy87Eventemitter2.default);

exports.default = DDP;