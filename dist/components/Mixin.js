'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _trackr = require('trackr');

var _trackr2 = _interopRequireDefault(_trackr);

var _ejson = require('ejson');

var _ejson2 = _interopRequireDefault(_ejson);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = {
  componentWillMount: function componentWillMount() {
    var _this = this;

    _Data2.default.waitDdpReady(function () {
      if (_this.getMeteorData) {
        _this.data = {};
        _this._meteorDataManager = new MeteorDataManager(_this);
        var newData = _this._meteorDataManager.calculateData();
        _this._meteorDataManager.updateData(newData);
      }

      if (_this.startMeteorSubscriptions) {
        console.warn('startMeteorSubscriptions is deprecated and will be removed soon. Please create your subscriptions in getMeteorData.');
        _this._meteorSubscriptionsManager = new MeteorSubscriptionsManager(_this);
        _this._meteorSubscriptionsManager.getMeteorSubscriptions();
      }
    });
  },
  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {

    if (this.startMeteorSubscriptions) {
      if (!_ejson2.default.equals(this.state, nextState) || !_ejson2.default.equals(this.props, nextProps)) {
        this._meteorSubscriptionsManager._meteorDataChangedCallback();
      }
    }

    if (this.getMeteorData) {
      var saveProps = this.props;
      var saveState = this.state;
      var newData = void 0;
      try {
        // Temporarily assign this.state and this.props,
        // so that they are seen by getMeteorData!
        // This is a simulation of how the proposed Observe API
        // for React will work, which calls observe() after
        // componentWillUpdate and after props and state are
        // updated, but before render() is called.
        // See https://github.com/facebook/react/issues/3398.
        this.props = nextProps;
        this.state = nextState;
        newData = this._meteorDataManager.calculateData();
      } finally {
        this.props = saveProps;
        this.state = saveState;
      }

      this._meteorDataManager.updateData(newData);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._meteorDataManager) {
      this._meteorDataManager.dispose();
    }

    if (this._meteorSubscriptionsManager) {
      this._meteorSubscriptionsManager.dispose();
    }
  }
};

var MeteorSubscriptionsManager = function () {
  function MeteorSubscriptionsManager(component) {
    var _this2 = this;

    _classCallCheck(this, MeteorSubscriptionsManager);

    this.component = component;
    this.computation = null;

    this._meteorSubscriptionsDep = new _trackr2.default.Dependency();

    this._meteorDataChangedCallback = function () {
      _this2._meteorSubscriptionsDep.changed();
    };

    _Data2.default.onChange(this._meteorDataChangedCallback);
  }

  _createClass(MeteorSubscriptionsManager, [{
    key: 'dispose',
    value: function dispose() {
      if (this.computation) {
        this.computation.stop();
        this.computation = null;
      }

      _Data2.default.offChange(this._meteorDataChangedCallback);
    }
  }, {
    key: 'stateOrPropsChanged',
    value: function stateOrPropsChanged() {}
  }, {
    key: 'getMeteorSubscriptions',
    value: function getMeteorSubscriptions() {
      var _this3 = this;

      this.computation = _trackr2.default.nonreactive(function () {
        return _trackr2.default.autorun(function (c) {
          _this3._meteorSubscriptionsDep.depend();

          _this3.component.startMeteorSubscriptions();
        });
      });
    }
  }]);

  return MeteorSubscriptionsManager;
}();

// A class to keep the state and utility methods needed to manage
// the Meteor data for a component.


var MeteorDataManager = function () {
  function MeteorDataManager(component) {
    var _this4 = this;

    _classCallCheck(this, MeteorDataManager);

    this.component = component;
    this.computation = null;
    this.oldData = null;
    this._meteorDataDep = new _trackr2.default.Dependency();

    this._meteorDataChangedCallback = function () {
      _this4._meteorDataDep.changed();
    };

    _Data2.default.onChange(this._meteorDataChangedCallback);
  }

  _createClass(MeteorDataManager, [{
    key: 'dispose',
    value: function dispose() {
      if (this.computation) {
        this.computation.stop();
        this.computation = null;
      }

      _Data2.default.offChange(this._meteorDataChangedCallback);
    }
  }, {
    key: 'calculateData',
    value: function calculateData() {
      var _this5 = this;

      var component = this.component;

      if (!component.getMeteorData) {
        return null;
      }

      if (this.computation) {
        this.computation.stop();
        this.computation = null;
      }

      var data = void 0;
      // Use Tracker.nonreactive in case we are inside a Tracker Computation.
      // This can happen if someone calls `ReactDOM.render` inside a Computation.
      // In that case, we want to opt out of the normal behavior of nested
      // Computations, where if the outer one is invalidated or stopped,
      // it stops the inner one.

      this.computation = _trackr2.default.nonreactive(function () {
        return _trackr2.default.autorun(function (c) {
          _this5._meteorDataDep.depend();
          if (c.firstRun) {
            var savedSetState = component.setState;
            try {
              component.setState = function () {
                throw new Error("Can't call `setState` inside `getMeteorData` as this could cause an endless" + " loop. To respond to Meteor data changing, consider making this component" + " a \"wrapper component\" that only fetches data and passes it in as props to" + " a child component. Then you can use `componentWillReceiveProps` in that" + " child component.");
              };

              data = component.getMeteorData();
            } finally {
              component.setState = savedSetState;
            }
          } else {
            // Stop this computation instead of using the re-run.
            // We use a brand-new autorun for each call to getMeteorData
            // to capture dependencies on any reactive data sources that
            // are accessed.  The reason we can't use a single autorun
            // for the lifetime of the component is that Tracker only
            // re-runs autoruns at flush time, while we need to be able to
            // re-call getMeteorData synchronously whenever we want, e.g.
            // from componentWillUpdate.
            c.stop();
            // Calling forceUpdate() triggers componentWillUpdate which
            // recalculates getMeteorData() and re-renders the component.
            component.forceUpdate();
          }
        });
      });

      return data;
    }
  }, {
    key: 'updateData',
    value: function updateData(newData) {
      var component = this.component;
      var oldData = this.oldData;

      if (!(newData && (typeof newData === 'undefined' ? 'undefined' : _typeof(newData)) === 'object')) {
        throw new Error("Expected object returned from getMeteorData");
      }
      // update componentData in place based on newData
      for (var key in newData) {
        component.data[key] = newData[key];
      }
      // if there is oldData (which is every time this method is called
      // except the first), delete keys in newData that aren't in
      // oldData.  don't interfere with other keys, in case we are
      // co-existing with something else that writes to a component's
      // this.data.
      if (oldData) {
        for (var _key in oldData) {
          if (!(_key in newData)) {
            delete component.data[_key];
          }
        }
      }
      this.oldData = newData;
    }
  }]);

  return MeteorDataManager;
}();