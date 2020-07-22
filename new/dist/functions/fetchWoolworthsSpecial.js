"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _fs = _interopRequireDefault(require("fs"));

var _woolworthsVariables = require("../variables/woolworthsVariables");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CATEGORIES = [];
var PARAMS = {};
var PRODUCTS = [];
var PAGESIZE = 36;

var fetchWoolworthsSpecial = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetchCategoriesAndParams();

          case 2:
            _context.next = 4;
            return fetchProducts();

          case 4:
            console.log("TOTAL ".concat(PRODUCTS.length, " PRODUCTS!"));

            _fs["default"].writeFileSync("./data/products/woolworths-special-products.json", JSON.stringify(PRODUCTS));

            _fs["default"].writeFileSync("./data/products/woolworths-special-categories.json", JSON.stringify(CATEGORIES));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchWoolworthsSpecial() {
    return _ref.apply(this, arguments);
  };
}();

var fetchProducts = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var categoryIds, _i, _categoryIds, categoryId;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            categoryIds = Object.keys(PARAMS);
            _i = 0, _categoryIds = categoryIds;

          case 2:
            if (!(_i < _categoryIds.length)) {
              _context2.next = 9;
              break;
            }

            categoryId = _categoryIds[_i];
            _context2.next = 6;
            return fetchProductsOfCategory(categoryId);

          case 6:
            _i++;
            _context2.next = 2;
            break;

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchProducts() {
    return _ref2.apply(this, arguments);
  };
}();

var fetchProductsOfCategory = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(categoryId) {
    var response, totalProducts, totalPages, i;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _axios["default"].get(_woolworthsVariables.productsApi, {
              params: PARAMS[categoryId]
            });

          case 2:
            response = _context3.sent;
            totalProducts = response.data.TotalRecordCount;
            totalPages = Math.ceil(totalProducts / PAGESIZE);

            if (!(totalPages > 0)) {
              _context3.next = 15;
              break;
            }

            i = 1;

          case 7:
            if (!(i <= totalPages)) {
              _context3.next = 13;
              break;
            }

            _context3.next = 10;
            return fetchProductsOfPage(categoryId, i);

          case 10:
            i++;
            _context3.next = 7;
            break;

          case 13:
            _context3.next = 16;
            break;

          case 15:
            CATEGORIES = CATEGORIES.filter(function (c) {
              return c.id !== categoryId;
            });

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchProductsOfCategory(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchProductsOfPage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(categoryId, pageNumber) {
    var params, response, fetchedProducts, _iterator, _step, _loop, _ret;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = _objectSpread(_objectSpread({}, PARAMS[categoryId]), {}, {
              pageNumber: pageNumber
            });
            _context4.next = 3;
            return _axios["default"].get(_woolworthsVariables.productsApi, {
              params: params
            });

          case 3:
            response = _context4.sent;
            fetchedProducts = response.data.Bundles;
            _iterator = _createForOfIteratorHelper(fetchedProducts);
            _context4.prev = 6;

            _loop = function _loop() {
              var fetchedProduct = _step.value;
              var data = fetchedProduct.Products[0];
              if (!data.InstoreIsOnSpecial) return "continue";
              var id = "w-".concat(data.UrlFriendlyName);

              if (typeof data.Stockcode === 'number') {
                if (typeof data.Barcode === 'string') {
                  id = "w-".concat(data.Stockcode, "-").concat(data.Barcode);
                } else {
                  id = "w-".concat(data.Stockcode);
                }
              }

              var name = data.Name ? data.Name.trim() : '';
              var brand = data.Brand ? getBrand(data.Brand.trim()) : 'Woolworths';
              var imageUrls = [data.DetailsImagePaths[0]];
              var storeId = 'woolworths';
              var packageSize = data.PackageSize ? data.PackageSize.trim() : null;
              var cupPrice = data.InstoreCupString ? data.InstoreCupString.trim() : null;
              var localPrice = {
                price: data.InstorePrice,
                discountRate: getDiscountRate(data),
                promo: getPromoText(data),
                orgPrice: data.InstoreWasPrice
              };
              var locations = {
                ALL: localPrice // NSW: localPrice,
                // QLD: localPrice,
                // TAS: localPrice,
                // WA: localPrice,
                // SA: localPrice,
                // NT: localPrice,
                // ACT: localPrice,

              };
              var categoryIds = [categoryId];
              var newProduct = {
                id: id,
                name: name,
                brand: brand,
                imageUrls: imageUrls,
                storeId: storeId,
                packageSize: packageSize,
                cupPrice: cupPrice,
                locations: locations,
                categoryIds: categoryIds,
                similarProducts: []
              };
              var foundIndex = PRODUCTS.findIndex(function (p) {
                return p.id === id;
              });

              if (foundIndex > -1) {
                if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
                  PRODUCTS[foundIndex].categoryIds.push(categoryId);
                }

                console.log(PRODUCTS[foundIndex]);
              } else {
                console.log(newProduct);
                PRODUCTS.push(newProduct);
              }
            };

            _iterator.s();

          case 9:
            if ((_step = _iterator.n()).done) {
              _context4.next = 15;
              break;
            }

            _ret = _loop();

            if (!(_ret === "continue")) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt("continue", 13);

          case 13:
            _context4.next = 9;
            break;

          case 15:
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](6);

            _iterator.e(_context4.t0);

          case 20:
            _context4.prev = 20;

            _iterator.f();

            return _context4.finish(20);

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[6, 17, 20, 23]]);
  }));

  return function fetchProductsOfPage(_x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}();

var getBrand = function getBrand(str) {
  return str.toLowerCase().split(' ').map(function (s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
  }).join(' ');
};

var getDiscountRate = function getDiscountRate(data) {
  var rate1 = 0;
  var rate2 = 0;

  if (data.InstorePrice === data.InstoreWasPrice) {
    var promoText = getPromoText(data).replace('$', '');
    var parts = promoText.split(' ');
    var quantity = Number(parts[0]);
    var amount = Number(parts[parts.length - 1]);
    var one = amount / quantity;
    rate1 = Math.round(100 - one / data.InstorePrice * 100);
  } else {
    rate2 = Math.round(100 - data.InstorePrice / data.InstoreWasPrice * 100);
  }

  return rate1 >= rate2 ? rate1 : rate2;
};

var getPromoText = function getPromoText(data) {
  var tagContent = data.CentreTag.TagContent;

  if (tagContent && typeof tagContent === 'string') {
    var parts = tagContent.split('>');

    var _iterator2 = _createForOfIteratorHelper(parts),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var part = _step2.value;

        if (part.includes('for $')) {
          return part.substr(0, part.indexOf('<')).trim();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return '';
};

var fetchCategoriesAndParams = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var response, responseData, whitelistIds, whitelistSpecialIds, _iterator3, _step3, category, categoryId, _iterator4, _step4, special, location;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _axios["default"].get(_woolworthsVariables.categoriesApi);

          case 2:
            response = _context5.sent;
            responseData = response.data.Categories;
            whitelistIds = [];
            whitelistSpecialIds = [];

            _woolworthsVariables.categoryWhitelist.map(function (c) {
              whitelistIds.push(c.id);
              whitelistSpecialIds.push(c.specialId);
            });

            _iterator3 = _createForOfIteratorHelper(responseData);
            _context5.prev = 8;

            _iterator3.s();

          case 10:
            if ((_step3 = _iterator3.n()).done) {
              _context5.next = 36;
              break;
            }

            category = _step3.value;

            if (!whitelistIds.includes(category.UrlFriendlyName)) {
              _context5.next = 34;
              break;
            }

            categoryId = "w-".concat(category.UrlFriendlyName);
            CATEGORIES.push({
              id: categoryId,
              name: category.Description
            });
            _iterator4 = _createForOfIteratorHelper(category.Children);
            _context5.prev = 16;

            _iterator4.s();

          case 18:
            if ((_step4 = _iterator4.n()).done) {
              _context5.next = 26;
              break;
            }

            special = _step4.value;

            if (!whitelistSpecialIds.includes(special.UrlFriendlyName)) {
              _context5.next = 24;
              break;
            }

            location = "/shop/browse/".concat(category.UrlFriendlyName, "/").concat(special.UrlFriendlyName);
            PARAMS[categoryId] = {
              categoryId: special.NodeId,
              filters: null,
              formatObject: "{\"name\": \"".concat(special.Description, "\"}"),
              isBundle: false,
              isMobile: false,
              isSpecial: true,
              location: location,
              pageNumber: 1,
              pageSize: PAGESIZE,
              sortType: 'Name',
              url: location
            };
            return _context5.abrupt("break", 26);

          case 24:
            _context5.next = 18;
            break;

          case 26:
            _context5.next = 31;
            break;

          case 28:
            _context5.prev = 28;
            _context5.t0 = _context5["catch"](16);

            _iterator4.e(_context5.t0);

          case 31:
            _context5.prev = 31;

            _iterator4.f();

            return _context5.finish(31);

          case 34:
            _context5.next = 10;
            break;

          case 36:
            _context5.next = 41;
            break;

          case 38:
            _context5.prev = 38;
            _context5.t1 = _context5["catch"](8);

            _iterator3.e(_context5.t1);

          case 41:
            _context5.prev = 41;

            _iterator3.f();

            return _context5.finish(41);

          case 44:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[8, 38, 41, 44], [16, 28, 31, 34]]);
  }));

  return function fetchCategoriesAndParams() {
    return _ref5.apply(this, arguments);
  };
}();

var _default = fetchWoolworthsSpecial;
exports["default"] = _default;