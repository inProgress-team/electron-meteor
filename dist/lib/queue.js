"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Queue = function () {

    /*
    *   As the name implies, `consumer` is the (sole) consumer of the queue.
    *   It gets called with each element of the queue and its return value
    *   serves as a ack, determining whether the element is removed or not from
    *   the queue, allowing then subsequent elements to be processed.
    */

    function Queue(consumer) {
        (0, _classCallCheck3.default)(this, Queue);

        this.consumer = consumer;
        this.queue = [];
    }

    (0, _createClass3.default)(Queue, [{
        key: "push",
        value: function push(element) {
            this.queue.push(element);
            this.process();
        }
    }, {
        key: "process",
        value: function process() {
            if (this.queue.length !== 0) {
                var ack = this.consumer(this.queue[0]);
                if (ack) {
                    this.queue.shift();
                    this.process();
                }
            }
        }
    }, {
        key: "empty",
        value: function empty() {
            this.queue = [];
        }
    }]);
    return Queue;
}();

exports.default = Queue;