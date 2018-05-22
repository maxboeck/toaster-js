"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Do not import this module to the application! Import index.js instead.

/**
 * @type {Toaster}
 */
var toaster = exports.toaster = new Toaster();

/**
 * Toasts controller. Controls toasts that appear on the screen.
 * @constructor
 * @private
 */
function Toaster() {

  /**
   * @type {Toast[]}
   */
  this.toasts = [];

  /**
      * Keeps the timeouts of toasts which are removed.
   * @type {Map}
   */
  this.timeouts = new Map();
}

/**
 * @param {Toast} toast
 * @param {number} timeout
 */
Toaster.prototype.push = function (toast, timeout) {
  var _this = this;

  requestAnimationFrame(function () {

    var height = toast.attach(0);

    _this.toasts.forEach(function (toast) {
      toast.seek(height);
    });
    _this.toasts.push(toast);

    _this.timeouts.set(toast, setTimeout(function () {
      return _this.remove(toast);
    }, timeout));
  });
};

/**
 * @param {Toast} toast
 */
Toaster.prototype.remove = function (toast) {

  if (this.timeouts.has(toast)) {
    clearTimeout(this.timeouts.get(toast));
    this.timeouts.delete(toast);
  } else {
    return; // already deleted
  }

  var index = this.toasts.indexOf(toast);
  var tst = this.toasts.splice(index, 1)[0];
  var height = toast.element.offsetHeight;

  tst.detach();
  this.toasts.slice(0, index).forEach(function (t) {
    return t.seek(-height);
  });
};

Toaster.prototype.removeAll = function () {
  while (this.toasts.length > 0) {
    this.remove(this.toasts[0]);
  }
};
