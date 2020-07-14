"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _fs = _interopRequireDefault(require("fs"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* Product object format:
 * {
 *  id: string,
 *  brand: string,
 *  name: string,
 *  imageUrl: string,
 *  categories: Array of string,
 *  subCategories: Array of string,
 *  locations: ['vic', 'sa','nsw','qld','act','nt','wa','qld']
 *
 * }
 */
var api = 'https://www.chemistwarehouse.com.au/searchapi/webapi/search/category?'; //category=542&index=0&sort='

var getCategorisedChemistProducts = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(categories) {
    var products, _iterator, _step, _loop;

    return _regenerator["default"].wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            products = [];
            _iterator = _createForOfIteratorHelper(categories);
            _context3.prev = 3;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var category, _iterator2, _step2, _loop2;

              return _regenerator["default"].wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      category = _step.value;
                      console.log("Fetching products in category ".concat(category.categoryName));
                      _iterator2 = _createForOfIteratorHelper(category.subCategories);
                      _context2.prev = 3;
                      _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                        var subCategory, fetchingApi, response, totalItems, numberOfPages, i, currentIndex, pageApi, pageResponse, items, _iterator3, _step3, _loop3, _ret;

                        return _regenerator["default"].wrap(function _loop2$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                subCategory = _step2.value;
                                fetchingApi = "".concat(api, "category=").concat(subCategory.categoryNumber);
                                _context.next = 4;
                                return _axios["default"].get(fetchingApi);

                              case 4:
                                response = _context.sent;
                                totalItems = response.data.universes.universe[0].breadcrumbs['nr-of-items-in-selection'];
                                numberOfPages = Math.ceil(totalItems / 48);
                                i = 0;

                              case 8:
                                if (!(i < numberOfPages)) {
                                  _context.next = 37;
                                  break;
                                }

                                currentIndex = i * 48;
                                pageApi = "".concat(api, "category=").concat(subCategory.categoryNumber, "&index=").concat(currentIndex);
                                console.log(pageApi);
                                _context.next = 14;
                                return _axios["default"].get(pageApi);

                              case 14:
                                pageResponse = _context.sent;
                                items = pageResponse.data.universes.universe[0]['items-section'].items.item;
                                _iterator3 = _createForOfIteratorHelper(items);
                                _context.prev = 17;

                                _loop3 = function _loop3() {
                                  var item = _step3.value;
                                  var id = item.id;

                                  if (products.some(function (p) {
                                    return p.id === id;
                                  })) {
                                    products.map(function (p) {
                                      if (p.id === id) {
                                        console.log(p);

                                        if (p.categories[category.categoryId]) {
                                          p.categories[category.categoryId].push(subCategory.subCategoryId);
                                        } else {
                                          p.categories[category.categoryId] = [subCategory.subCategoryId];
                                        }

                                        p.categories[category.categoryId] = (0, _toConsumableArray2["default"])(new Set(p.categories[category.categoryId]));
                                      }
                                    });
                                    return "continue";
                                  }

                                  var itemCategories = {};
                                  itemCategories[category.categoryId] = [subCategory.subCategoryId];
                                  var name = '';
                                  var brand = '';
                                  var imageUrl = '';
                                  var price = '';
                                  var orgPrice = '';
                                  var locations = ['vic', 'sa', 'nsw', 'qld', 'act', 'nt', 'wa', 'qld'];

                                  var _iterator4 = _createForOfIteratorHelper(item.attribute),
                                      _step4;

                                  try {
                                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                                      var attr = _step4.value;
                                      var value = attr.value[0].value;

                                      switch (attr.name) {
                                        case 'name':
                                          name = value;
                                          break;

                                        case 'brand':
                                          brand = value;
                                          break;

                                        case '_thumburl':
                                          imageUrl = getImageUrl(value);
                                          break;

                                        case 'price_cw_au':
                                          price = value;
                                          break;

                                        case 'rrp_cw_au':
                                          orgPrice = value;
                                          break;
                                      }
                                    }
                                  } catch (err) {
                                    _iterator4.e(err);
                                  } finally {
                                    _iterator4.f();
                                  }

                                  products.push({
                                    id: id,
                                    name: name,
                                    brand: brand,
                                    imageUrl: imageUrl,
                                    price: price,
                                    orgPrice: orgPrice,
                                    categories: itemCategories,
                                    locations: locations
                                  });
                                };

                                _iterator3.s();

                              case 20:
                                if ((_step3 = _iterator3.n()).done) {
                                  _context.next = 26;
                                  break;
                                }

                                _ret = _loop3();

                                if (!(_ret === "continue")) {
                                  _context.next = 24;
                                  break;
                                }

                                return _context.abrupt("continue", 24);

                              case 24:
                                _context.next = 20;
                                break;

                              case 26:
                                _context.next = 31;
                                break;

                              case 28:
                                _context.prev = 28;
                                _context.t0 = _context["catch"](17);

                                _iterator3.e(_context.t0);

                              case 31:
                                _context.prev = 31;

                                _iterator3.f();

                                return _context.finish(31);

                              case 34:
                                i++;
                                _context.next = 8;
                                break;

                              case 37:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _loop2, null, [[17, 28, 31, 34]]);
                      });

                      _iterator2.s();

                    case 6:
                      if ((_step2 = _iterator2.n()).done) {
                        _context2.next = 10;
                        break;
                      }

                      return _context2.delegateYield(_loop2(), "t0", 8);

                    case 8:
                      _context2.next = 6;
                      break;

                    case 10:
                      _context2.next = 15;
                      break;

                    case 12:
                      _context2.prev = 12;
                      _context2.t1 = _context2["catch"](3);

                      _iterator2.e(_context2.t1);

                    case 15:
                      _context2.prev = 15;

                      _iterator2.f();

                      return _context2.finish(15);

                    case 18:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop, null, [[3, 12, 15, 18]]);
            });

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context3.next = 10;
              break;
            }

            return _context3.delegateYield(_loop(), "t0", 8);

          case 8:
            _context3.next = 6;
            break;

          case 10:
            _context3.next = 15;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t1 = _context3["catch"](3);

            _iterator.e(_context3.t1);

          case 15:
            _context3.prev = 15;

            _iterator.f();

            return _context3.finish(15);

          case 18:
            _fs["default"].writeFileSync("./data/products/chemist/products.json", JSON.stringify(products));

            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t2 = _context3["catch"](0);
            console.log(_context3.t2);
            return _context3.abrupt("return");

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee, null, [[0, 21], [3, 12, 15, 18]]);
  }));

  return function getCategorisedChemistProducts(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getImageUrl = function getImageUrl(url) {
  return url.includes('_200') ? url.replace('_200', '_800') : url;
};

var _default = getCategorisedChemistProducts;
exports["default"] = _default;