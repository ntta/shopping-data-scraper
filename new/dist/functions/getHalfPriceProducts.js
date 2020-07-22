"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireDefault(require("fs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var aLocations = ['VIC', 'NSW', 'WA', 'SA', 'ACT', 'NT', 'TAS', 'QLD'].sort();

var getHalfPriceProducts = function getHalfPriceProducts() {
  var storeIds = ['coles', 'woolworths', 'chemist-warehouse'];

  for (var _i = 0, _storeIds = storeIds; _i < _storeIds.length; _i++) {
    var storeId = _storeIds[_i];
    getFromStore(storeId);
  }
};

var getFromStore = function getFromStore(storeId) {
  var products = JSON.parse(_fs["default"].readFileSync("./data/products/".concat(storeId, "-special-products.json")));
  var newProducts = [];

  var _iterator = _createForOfIteratorHelper(products),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var product = _step.value;

      if (product.locations[Object.keys(product.locations)[0]].discountRate >= 50) {
        newProducts.push(polishProduct(product));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  _fs["default"].writeFileSync("./data/products/half-price/".concat(storeId, "-half-price-products.json"), JSON.stringify(newProducts));
};

var polishProduct = function polishProduct(product) {
  var polishedProduct = _objectSpread({}, product);

  var productLocations = Object.keys(polishedProduct.locations).sort();

  var _iterator2 = _createForOfIteratorHelper(productLocations),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var location = _step2.value;
      polishedProduct.locations[location].price = Number(polishedProduct.locations[location].price);
      polishedProduct.locations[location].orgPrice = Number(polishedProduct.locations[location].orgPrice);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  if (JSON.stringify(aLocations) === JSON.stringify(productLocations) && allAreEqual(product)) {
    delete polishedProduct.locations;
    polishedProduct['locations'] = {
      ALL: {
        price: product.locations['VIC'].price,
        discountRate: product.locations['VIC'].discountRate,
        promo: product.locations['VIC'].promo,
        orgPrice: product.locations['VIC'].orgPrice
      }
    };
  }

  if (typeof product.imageUrls === 'string') {
    polishedProduct.imageUrls = [polishedProduct.imageUrls];
  }

  polishedProduct.similarProducts = [];
  return polishedProduct;
};

var allAreEqual = function allAreEqual(product) {
  var productLocations = Object.keys(product.locations);

  if (productLocations.length === 8) {
    var price = product.locations['VIC'].price;
    var discountRate = product.locations['VIC'].discountRate;
    var promo = product.locations['VIC'].promo;
    var orgPrice = product.locations['VIC'].orgPrice;

    var _iterator3 = _createForOfIteratorHelper(productLocations),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var location = _step3.value;

        if (product.locations[location].price !== price || product.locations[location].discountRate !== discountRate || product.locations[location].promo !== promo || product.locations[location].orgPrice !== orgPrice) {
          return false;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return true;
  } else {
    return false;
  }
};

var _default = getHalfPriceProducts;
exports["default"] = _default;