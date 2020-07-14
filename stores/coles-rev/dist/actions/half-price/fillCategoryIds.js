"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _fs = _interopRequireDefault(require("fs"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var blacklist = ['back-to-school', 'convenience-meals', 'entertaining-at-home', 'fruit-vegetables', 'winter'];

var fillCategoryIds = function fillCategoryIds(products) {
  var resultProducts = (0, _toConsumableArray2["default"])(products);
  var allProducts = getAllProducts();
  resultProducts.map(function (product) {
    for (var _i = 0, _Object$keys = Object.keys(allProducts); _i < _Object$keys.length; _i++) {
      var id = _Object$keys[_i];

      if (!blacklist.includes(id)) {
        var categoryId = getCategoryId(id);

        var _iterator = _createForOfIteratorHelper(allProducts[id]),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var catProd = _step.value;

            if (product.id === catProd.id) {
              product.categoryIds.push(categoryId);
              product.categoryIds = (0, _toConsumableArray2["default"])(new Set(product.categoryIds));
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  });

  _fs["default"].writeFileSync('./data/products/half-price-coles-id.json', JSON.stringify(resultProducts));
};

var getAllProducts = function getAllProducts() {
  var products = {};
  var path = './data/products/coles/';

  var folder = _fs["default"].readdirSync(path);

  var _iterator2 = _createForOfIteratorHelper(folder),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var file = _step2.value;
      var categoryId = file.replace('.json', '');

      var data = _fs["default"].readFileSync(path + file);

      products[categoryId] = JSON.parse(data);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return products;
};

var getCategoryId = function getCategoryId(id) {
  if (id === 'dairy-eggs-meals') return 'dairy-eggs-fridge';
  if (id === 'frozen') return 'freezer';
  if (id === 'healthy-living') return 'health-beauty';
  if (id === 'international-fods') return 'international-foods';
  return id;
};

var _default = fillCategoryIds;
exports["default"] = _default;