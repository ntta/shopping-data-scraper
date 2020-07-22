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

var colesProductsPath = './data/products/half-price/coles-half-price-products.json';
var woolworthsProductsPath = './data/products/half-price/woolworths-half-price-products.json';
var chemistWarehouseProductsPath = './data/products/half-price/chemist-warehouse-half-price-products.json';
var allProducts = {};

var collectProductsFromStores = function collectProductsFromStores() {
  if (_fs["default"].existsSync(colesProductsPath)) {
    var data = _fs["default"].readFileSync(colesProductsPath);

    allProducts['coles'] = JSON.parse(data);
  }

  if (_fs["default"].existsSync(woolworthsProductsPath)) {
    var _data = _fs["default"].readFileSync(woolworthsProductsPath);

    allProducts['woolworths'] = JSON.parse(_data);
  }

  if (_fs["default"].existsSync(chemistWarehouseProductsPath)) {
    var _data2 = _fs["default"].readFileSync(chemistWarehouseProductsPath);

    allProducts['chemist-warehouse'] = JSON.parse(_data2);
  }
};

var findSimilarProducts = function findSimilarProducts() {
  collectProductsFromStores();
  var comparedStores = [];

  var _loop = function _loop() {
    var store = _Object$keys[_i];

    var _iterator = _createForOfIteratorHelper(allProducts[store]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var product = _step.value;

        var _iterator2 = _createForOfIteratorHelper(Object.keys(allProducts).filter(function (s) {
          return s !== store && !comparedStores.includes(s);
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
                  console.log("Product: ".concat(product.name));
                  console.log("Store: ".concat(store));
                  console.log("Comparing Product: ".concat(comparingProduct.name));
                  console.log("Comparing Store: ".concat(comparingStore));
                  console.log('----------------------------------');

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

    comparedStores.push(store);
  };

  for (var _i = 0, _Object$keys = Object.keys(allProducts); _i < _Object$keys.length; _i++) {
    _loop();
  }

  rewriteToFile();
};

var rewriteToFile = function rewriteToFile() {
  for (var _i2 = 0, _Object$keys2 = Object.keys(allProducts); _i2 < _Object$keys2.length; _i2++) {
    var store = _Object$keys2[_i2];

    _fs["default"].writeFileSync("./data/products/half-price/".concat(store, "-half-price-products.json"), JSON.stringify(allProducts[store])); // fs.writeFileSync(
    //   `./data/products/${store}-special-products.json`,
    //   JSON.stringify(allProducts[store])
    // );

  }
};

var areSimilar = function areSimilar(product, comparingProduct) {
  var isSimilarName = similarity(product.name, comparingProduct.name) >= 0.8;
  var isSimilarBrand = false;

  if (product.brand.trim() === '' || comparingProduct.brand.trim() === '') {
    isSimilarBrand = true;
  } else {
    isSimilarBrand = similarity(product.brand, comparingProduct.brand) >= 0.8;
  }

  return isSimilarName && isSimilarBrand;
}; // Use Levenshtein distance
// https://en.wikipedia.org/wiki/Levenshtein_distance


var similarity = function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;

  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }

  var longerLength = longer.length;

  if (longerLength == 0) {
    return 0.0;
  }

  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

var editDistance = function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();

  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;

    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }

    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
};

var alreadyHasThis = function alreadyHasThis(product, similarProduct) {
  var _iterator4 = _createForOfIteratorHelper(product.similarProducts),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var simProd = _step4.value;

      if (simProd.id === similarProduct.id && simProd.storeId === similarProduct.storeId) {
        return true;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return false;
};

var _default = findSimilarProducts;
exports["default"] = _default;