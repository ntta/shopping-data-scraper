"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _fs = _interopRequireDefault(require("fs"));

var _chemistVariables = require("../variables/chemistVariables");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var PRODUCTS = [];
var CATEGORIES = [];

var fetchNumberOfPages = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(subCategory) {
    var response, totalItems;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios["default"].get("".concat(_chemistVariables.categoryApi, "category=").concat(subCategory.categoryNumber));

          case 2:
            response = _context.sent;
            totalItems = response.data.universes.universe[0].breadcrumbs['nr-of-items-in-selection'];
            return _context.abrupt("return", Math.ceil(totalItems / 48));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchNumberOfPages(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCategoryId = function getCategoryId(str) {
  return 'cw-' + str.toLowerCase().trim().replace('&', '').replace(',', '').replace('(', '').replace(')', '').split(' ').filter(function (c) {
    return c !== '';
  }).join('-');
};

var addToCategories = function addToCategories(category) {
  if (category !== null) {
    var foundIndex = CATEGORIES.findIndex(function (c) {
      return c.id === getCategoryId(category.categoryName);
    });

    if (foundIndex < 0) {
      CATEGORIES.push({
        id: getCategoryId(category.categoryName),
        name: category.categoryName
      });
    }
  }
};

var fetchProductsEachPage = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(currentIndex, category, subCategory) {
    var pageApi, pageResponse, items, _iterator, _step, _loop, _ret;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pageApi = "".concat(_chemistVariables.categoryApi, "category=").concat(subCategory === null ? category.categoryNumber : subCategory.categoryNumber, "&index=").concat(currentIndex);
            console.log(pageApi);
            _context2.next = 4;
            return _axios["default"].get(pageApi);

          case 4:
            pageResponse = _context2.sent;
            items = pageResponse.data.universes.universe[0]['items-section'].items.item;
            addToCategories(category);
            addToCategories(subCategory);
            _iterator = _createForOfIteratorHelper(items);
            _context2.prev = 9;

            _loop = function _loop() {
              var item = _step.value;
              var id = "cw-".concat(item.id);
              var foundIndex = PRODUCTS.findIndex(function (p) {
                return p.id === id;
              });
              var categoryId = subCategory === null ? getCategoryId(category.categoryName) : "".concat(getCategoryId(category.categoryName), "/").concat(getCategoryId(subCategory.categoryName));

              if (foundIndex > -1) {
                if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
                  PRODUCTS[foundIndex].categoryIds.push(categoryId);
                }

                return "continue";
              }

              var categoryIds = [categoryId];
              var name = '';
              var brand = '';
              var promo = '';
              var imageUrls = [];
              var price = 0;
              var orgPrice = 0;

              var _iterator2 = _createForOfIteratorHelper(item.attribute),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var attr = _step2.value;
                  var value = attr.value[0].value;

                  switch (attr.name) {
                    case 'name':
                      name = value;
                      break;

                    case 'brand':
                      brand = value;
                      break;

                    case '_thumburl':
                      imageUrls = [getImageUrl(value)];
                      break;

                    case 'price_cw_au':
                      price = Number(value);
                      break;

                    case 'rrp_cw_au':
                      orgPrice = Number(value);
                      break;

                    case 'splat':
                      promo = value;
                      break;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              var discountRate = getDiscountRate(price, orgPrice);
              promo = getPromoText(promo);
              var locations = {
                ALL: {
                  price: price,
                  discountRate: discountRate,
                  promo: promo,
                  orgPrice: orgPrice
                }
              };
              if (price === orgPrice && discountRate === 0) return "continue";
              PRODUCTS.push({
                id: id,
                name: name,
                brand: brand,
                imageUrls: imageUrls,
                storeId: 'chemist-warehouse',
                packageSize: '',
                cupPrice: '',
                categoryIds: categoryIds,
                locations: locations,
                similarProducts: []
              });
            };

            _iterator.s();

          case 12:
            if ((_step = _iterator.n()).done) {
              _context2.next = 18;
              break;
            }

            _ret = _loop();

            if (!(_ret === "continue")) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt("continue", 16);

          case 16:
            _context2.next = 12;
            break;

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](9);

            _iterator.e(_context2.t0);

          case 23:
            _context2.prev = 23;

            _iterator.f();

            return _context2.finish(23);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 20, 23, 26]]);
  }));

  return function fetchProductsEachPage(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getDiscountRate = function getDiscountRate(price, orgPrice) {
  return Math.round(100 - price / orgPrice * 100);
};

var getPromoText = function getPromoText(str) {
  return str.includes('online_only') ? 'Online Only' : '';
};

var fetchChemistSpecial = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _iterator3, _step3, category, numberOfPages, i, _iterator5, _step5, subCategory, _numberOfPages, _i, filteringCategories, _iterator4, _step4, _loop2;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _iterator3 = _createForOfIteratorHelper(_chemistVariables.categoryList);
            _context3.prev = 1;

            _iterator3.s();

          case 3:
            if ((_step3 = _iterator3.n()).done) {
              _context3.next = 45;
              break;
            }

            category = _step3.value;
            console.log("Fetching products in category ".concat(category.categoryName));

            if (!(category.subCategories.length === 0)) {
              _context3.next = 18;
              break;
            }

            _context3.next = 9;
            return fetchNumberOfPages(category);

          case 9:
            numberOfPages = _context3.sent;
            i = 0;

          case 11:
            if (!(i < numberOfPages)) {
              _context3.next = 17;
              break;
            }

            _context3.next = 14;
            return fetchProductsEachPage(i * 48, category, null);

          case 14:
            i++;
            _context3.next = 11;
            break;

          case 17:
            return _context3.abrupt("continue", 43);

          case 18:
            _iterator5 = _createForOfIteratorHelper(category.subCategories);
            _context3.prev = 19;

            _iterator5.s();

          case 21:
            if ((_step5 = _iterator5.n()).done) {
              _context3.next = 35;
              break;
            }

            subCategory = _step5.value;
            _context3.next = 25;
            return fetchNumberOfPages(subCategory);

          case 25:
            _numberOfPages = _context3.sent;
            _i = 0;

          case 27:
            if (!(_i < _numberOfPages)) {
              _context3.next = 33;
              break;
            }

            _context3.next = 30;
            return fetchProductsEachPage(_i * 48, category, subCategory);

          case 30:
            _i++;
            _context3.next = 27;
            break;

          case 33:
            _context3.next = 21;
            break;

          case 35:
            _context3.next = 40;
            break;

          case 37:
            _context3.prev = 37;
            _context3.t0 = _context3["catch"](19);

            _iterator5.e(_context3.t0);

          case 40:
            _context3.prev = 40;

            _iterator5.f();

            return _context3.finish(40);

          case 43:
            _context3.next = 3;
            break;

          case 45:
            _context3.next = 50;
            break;

          case 47:
            _context3.prev = 47;
            _context3.t1 = _context3["catch"](1);

            _iterator3.e(_context3.t1);

          case 50:
            _context3.prev = 50;

            _iterator3.f();

            return _context3.finish(50);

          case 53:
            filteringCategories = (0, _toConsumableArray2["default"])(CATEGORIES);
            _iterator4 = _createForOfIteratorHelper(filteringCategories);

            try {
              _loop2 = function _loop2() {
                var category = _step4.value;
                var found = false;

                var _iterator6 = _createForOfIteratorHelper(PRODUCTS),
                    _step6;

                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    var product = _step6.value;

                    var _iterator7 = _createForOfIteratorHelper(product.categoryIds),
                        _step7;

                    try {
                      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                        var categoryId = _step7.value;

                        if (categoryId.includes(category.id)) {
                          found = true;
                        }
                      }
                    } catch (err) {
                      _iterator7.e(err);
                    } finally {
                      _iterator7.f();
                    }
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }

                if (!found) {
                  CATEGORIES = CATEGORIES.filter(function (c) {
                    return c.id !== category.id;
                  });
                }
              };

              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                _loop2();
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            _fs["default"].writeFileSync(_chemistVariables.chemistWarehouseProductsPath, JSON.stringify(PRODUCTS));

            _fs["default"].writeFileSync(_chemistVariables.chemistWarehouseCategoriesPath, JSON.stringify(CATEGORIES));

          case 58:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 47, 50, 53], [19, 37, 40, 43]]);
  }));

  return function fetchChemistSpecial() {
    return _ref3.apply(this, arguments);
  };
}();

var getImageUrl = function getImageUrl(url) {
  return url.includes('_200') ? url.replace('_200', '_800') : url;
};

var _default = fetchChemistSpecial;
exports["default"] = _default;