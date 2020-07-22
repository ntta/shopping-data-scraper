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

var getHalfPriceCategories = function getHalfPriceCategories() {
  var storeIds = ['coles', 'woolworths', 'chemist-warehouse'];

  for (var _i = 0, _storeIds = storeIds; _i < _storeIds.length; _i++) {
    var storeId = _storeIds[_i];
    getFromStore(storeId);
  }
};

var getFromStore = function getFromStore(storeId) {
  var products = JSON.parse(_fs["default"].readFileSync("./data/products/half-price/".concat(storeId, "-half-price-products.json")));
  var categories = JSON.parse(_fs["default"].readFileSync("./data/products/".concat(storeId, "-special-categories.json")));
  var newCategories = [];

  var _iterator = _createForOfIteratorHelper(products),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var product = _step.value;

      var _iterator2 = _createForOfIteratorHelper(product.categoryIds),
          _step2;

      try {
        var _loop = function _loop() {
          var prodCate = _step2.value;
          var parts = prodCate.split('/');
          var foundIndex = newCategories.findIndex(function (c) {
            return c.id === parts[0];
          });

          if (foundIndex < 0) {
            if (parts.length === 1) {
              newCategories.push({
                id: parts[0],
                name: categories.find(function (c) {
                  return c.id === parts[0];
                }).name
              });
            }

            if (parts.length === 2) {
              newCategories.push({
                id: parts[0],
                name: categories.find(function (c) {
                  return c.id === parts[0];
                }).name,
                subCategories: [{
                  id: parts[1],
                  name: categories.find(function (c) {
                    return c.id === parts[1];
                  }).name
                }]
              });
            }
          } else {
            if (parts.length === 2) {
              var foundSubIndex = newCategories[foundIndex].subCategories.findIndex(function (c) {
                return c.id === parts[1];
              });

              if (foundSubIndex < 0) {
                newCategories[foundIndex].subCategories.push({
                  id: parts[1],
                  name: categories.find(function (c) {
                    return c.id === parts[1];
                  }).name
                });
              }
            }
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  _fs["default"].writeFileSync("./data/products/half-price/".concat(storeId, "-half-price-categories.json"), JSON.stringify(newCategories));
};

var _default = getHalfPriceCategories;
exports["default"] = _default;