"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configureToasts = configureToasts;
exports.deleteAllToasts = deleteAllToasts;
exports.Toast = Toast;

var _Toaster = require("./Toaster.js");

Toast.TYPE_INFO = "info";
Toast.TYPE_MESSAGE = "message";
Toast.TYPE_WARNING = "warning";
Toast.TYPE_ERROR = "error";
Toast.TYPE_DONE = "done";

Toast.TIME_SHORT = 2000;
Toast.TIME_NORMAL = 4000;
Toast.TIME_LONG = 8000;

var options = {
    deleteDelay: 300,
    topOrigin: 0
};

/**
 * Allows you to configure Toasts options during the application setup.
 * @param newOptions
 */
function configureToasts() {
    var newOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.assign(options, newOptions);
}

/**
 * Delete all toast currently displayed.
 */
function deleteAllToasts() {
    return _Toaster.toaster.removeAll();
}

/**
 * On-screen toast message.
 * @param {string|Element} text - Message text.
 * @param {string} [type] - Toast.TYPE_*
 * @param {number} [timeout] - Toast.TIME_*
 * @constructor
 */
function Toast() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "No text!";
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Toast.TYPE_INFO;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Toast.TIME_LONG;


    var el1 = document.createElement("div"),
        el2 = document.createElement("div");

    el1.className = "toast";
    el2.className = "body " + type;
    el1.appendChild(el2);
    if (text instanceof Element) {
        el2.appendChild(text);
    } else {
        el2.textContent = "" + text;
    }

    this.element = el1;
    this.position = 0;

    _Toaster.toaster.push(this, timeout);
}

/**
 * Attaches toast to DOM and returns the height of the element.
 */
Toast.prototype.attach = function (position) {
    var _this = this;

    this.position = position;
    this.updateVisualPosition();
    document.body.appendChild(this.element);
    requestAnimationFrame(function () {
        _this.element.classList.add("displayed");
    });

    return this.element.offsetHeight;
};

/**
 * Seek the toast message by Y coordinate.
 * @param delta
 */
Toast.prototype.seek = function (delta) {

    this.position += delta;
    this.updateVisualPosition();
};

/**
 * @private
 */
Toast.prototype.updateVisualPosition = function () {
    var _this2 = this;

    requestAnimationFrame(function () {
        _this2.element.style.bottom = -options.topOrigin + _this2.position + "px";
    });
};

/**
 * Removes toast from DOM.
 */
Toast.prototype.detach = function () {
    var _this3 = this;

    var self = this;

    if (!this.element.parentNode) return;

    requestAnimationFrame(function () {
        _this3.element.classList.remove("displayed");
        _this3.element.classList.add("deleted");
    });
    setTimeout(function () {
        requestAnimationFrame(function () {
            if (!self.element || !self.element.parentNode) return;
            self.element.parentNode.removeChild(self.element);
        });
    }, options.deleteDelay);
};

Toast.prototype.delete = function () {

    _Toaster.toaster.remove(this);
};
