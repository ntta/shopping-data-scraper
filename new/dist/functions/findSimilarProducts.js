"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _colesVariables = require("../variables/colesVariables");

var _woolworthsVariables = require("../variables/woolworthsVariables");

var _fs = _interopRequireDefault(require("fs"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var allProducts = {};

var collectProductsFromStores = function collectProductsFromStores() {
  if (_fs["default"].existsSync(_colesVariables.colesProductsPath)) {
    var data = _fs["default"].readFileSync(_colesVariables.colesProductsPath);

    allProducts['coles'] = JSON.parse(data);
  }

  if (_fs["default"].existsSync(_woolworthsVariables.woolworthsProductsPath)) {
    var _data = _fs["default"].readFileSync(_woolworthsVariables.woolworthsProductsPath);

    allProducts['woolworths'] = JSON.parse(_data);
  }
};

var findSimilarProducts = function findSimilarProducts() {
  collectProductsFromStores();

  var _loop = function _loop() {
    var store = _Object$keys[_i];

    var _iterator = _createForOfIteratorHelper(allProducts[store]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var product = _step.value;

        var _iterator2 = _createForOfIteratorHelper(Object.keys(allProducts).filter(function (s) {
          return s !== store;
        })),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var comparingStore = _step2.value;

            var _iterator3 = _createForOfIteratorHelper(allProducts[comparingStore]),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var comparingProduct = _step3.value;

                if (areSimilar(product, comparingProduct)) {
                  if (!alreadyHasThis(product, comparingProduct)) {
                    product.similarProducts.push({
                      productId: comparingProduct.id,
                      storeId: comparingProduct.storeId
                    });
                  }

                  if (!alreadyHasThis(comparingProduct, product)) {
                    comparingProduct.similarProducts.push({
                      productId: product.id,
                      storeId: product.storeId
                    });
                  }
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
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
  };

  for (var _i = 0, _Object$keys = Object.keys(allProducts); _i < _Object$keys.length; _i++) {
    _loop();
  }
};

var areSimilar = function areSimilar(product, comparingProduct) {// need to implement
};

var alreadyHasThis = function alreadyHasThis(product, similarProduct) {// check if product already has similarProduct in similarProducts
};

var _default = findSimilarProducts;
exports["default"] = _default;