"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var path = './data/products/';

var mergeProductsCategories = function mergeProductsCategories() {
  var allFiles = _fs["default"].readdirSync(path);

  var coles = {
    products: [],
    categories: []
  };
  var woolworths = {
    products: [],
    categories: []
  };

  var _iterator = _createForOfIteratorHelper(allFiles),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var file = _step.value;
      var filePath = path + file;

      if (file.includes('products')) {
        if (file.includes('coles')) {
          coles.products.push(filePath);
          continue;
        }

        if (file.includes('woolworths')) {
          woolworths.products.push(filePath);
          continue;
        }
      } else {
        if (file.includes('coles')) {
          coles.categories.push(filePath);
          continue;
        }

        if (file.includes('woolworths')) {
          woolworths.categories.push(filePath);
          continue;
        }
      }

      continue;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  mergeColes(coles);
  mergeWoolworths(woolworths);
};

var mergeColes = function mergeColes(coles) {};

var mergeWoolworths = function mergeWoolworths(woolworths) {};

var _default = mergeProductsCategories;
exports["default"] = _default;