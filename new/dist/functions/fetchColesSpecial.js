"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteerExtra = _interopRequireDefault(require("puppeteer-extra"));

var _puppeteerExtraPluginStealth = _interopRequireDefault(require("puppeteer-extra-plugin-stealth"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _fs = _interopRequireDefault(require("fs"));

var _colesVariables = require("../variables/colesVariables");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var PRODUCTS = [];
var CATEGORIES = [];
var currentLocation = '';

var fetchColesSpecial = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(locationId) {
    var location;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            location = _colesVariables.colesLocations.find(function (l) {
              return l.id === locationId;
            });
            currentLocation = locationId;
            _context.next = 4;
            return fetchEachLocation(location);

          case 4:
            _fs["default"].writeFileSync("./data/products/coles-special-products-".concat(locationId, ".json"), JSON.stringify(PRODUCTS));

            _fs["default"].writeFileSync("./data/products/coles-special-categories-".concat(locationId, ".json"), JSON.stringify(CATEGORIES));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchColesSpecial(_x) {
    return _ref.apply(this, arguments);
  };
}();

var ensureCorrectUrl = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(page, url, location) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (page.url().includes(location.area)) {
              _context2.next = 19;
              break;
            }

            _context2.next = 3;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 3:
            _context2.next = 5;
            return page.click('#changeLocationBar');

          case 5:
            _context2.next = 7;
            return page.waitFor(1000);

          case 7:
            _context2.next = 9;
            return page.type('#search-form > p', location.postcode);

          case 9:
            _context2.next = 11;
            return page.waitFor(1000);

          case 11:
            _context2.next = 13;
            return page.keyboard.press('Enter');

          case 13:
            _context2.next = 15;
            return page.waitForNavigation({
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 15:
            _context2.next = 17;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 17:
            _context2.next = 0;
            break;

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function ensureCorrectUrl(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchEachLocation = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(location) {
    var url, browser, page;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = location.url;
            console.log("Getting special products from ".concat(location.id));
            _context3.prev = 2;

            _puppeteerExtra["default"].use((0, _puppeteerExtraPluginStealth["default"])());

            _context3.next = 6;
            return _puppeteerExtra["default"].launch({
              headless: false
            });

          case 6:
            browser = _context3.sent;
            _context3.next = 9;
            return browser.newPage();

          case 9:
            page = _context3.sent;
            _context3.next = 12;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 12:
            _context3.next = 14;
            return ensureCorrectUrl(page, url, location);

          case 14:
            _context3.next = 16;
            return fetchProducts(page, url, location);

          case 16:
            _context3.next = 18;
            return browser.close();

          case 18:
            _context3.next = 24;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](2);
            console.log(_context3.t0);
            return _context3.abrupt("return");

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 20]]);
  }));

  return function fetchEachLocation(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchProducts = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(page, url, location) {
    var bodyHtml, $, categoryList, i;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (page.url().includes(location.area)) {
              _context5.next = 5;
              break;
            }

            _context5.next = 3;
            return ensureCorrectUrl(page, url, location);

          case 3:
            _context5.next = 0;
            break;

          case 5:
            _context5.next = 7;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 7:
            _context5.next = 9;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 9:
            bodyHtml = _context5.sent;
            $ = _cheerio["default"].load(bodyHtml);
            categoryList = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'));

            if (!(categoryList.length > 0)) {
              _context5.next = 20;
              break;
            }

            i = 0;

          case 14:
            if (!(i < categoryList.length)) {
              _context5.next = 20;
              break;
            }

            if (_colesVariables.categoryBlacklist.includes(categoryList[i].children[0].data)) {
              _context5.next = 17;
              break;
            }

            return _context5.delegateYield( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
              var href, categoryName, categoryId, foundCatIndex;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      href = categoryList[i].parent.parent.attribs.href;
                      categoryName = categoryList[i].children[0].data;
                      categoryId = getCategoryId(categoryName);
                      foundCatIndex = CATEGORIES.findIndex(function (c) {
                        return c.id === categoryId;
                      });

                      if (foundCatIndex < 0) {
                        CATEGORIES.push({
                          id: categoryId,
                          name: categoryName
                        });
                      }

                      _context4.next = 7;
                      return fetchProductsOfCategory(page, _colesVariables.colesUrl + href, categoryId);

                    case 7:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })(), "t0", 17);

          case 17:
            i++;
            _context5.next = 14;
            break;

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function fetchProducts(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var fetchProductsOfCategory = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(page, url, categoryId) {
    var bodyHtml, $, pageNumber, urls, i, html;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 2:
            _context6.next = 4;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 4:
            bodyHtml = _context6.sent;
            $ = _cheerio["default"].load(bodyHtml);
            pageNumber = 0;

            try {
              pageNumber = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data);
            } catch (err) {
              pageNumber = 1;
            }

            urls = getPaginationUrls(url, pageNumber);
            getProductsEachPage(bodyHtml, categoryId);

            if (!(urls.length > 1)) {
              _context6.next = 23;
              break;
            }

            i = 1;

          case 12:
            if (!(i < urls.length)) {
              _context6.next = 23;
              break;
            }

            _context6.next = 15;
            return page["goto"](urls[i], {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 15:
            _context6.next = 17;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 17:
            html = _context6.sent;
            console.log(urls[i]);
            getProductsEachPage(html, categoryId);

          case 20:
            i++;
            _context6.next = 12;
            break;

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetchProductsOfCategory(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

var getPaginationUrls = function getPaginationUrls(url, pageNumber) {
  var urls = [];
  var urlWithoutPage = url.substring(0, url.length - 1);

  for (var i = 1; i <= pageNumber; i++) {
    urls.push("".concat(urlWithoutPage).concat(String(i)));
  }

  return urls;
};

var getProductsEachPage = function getProductsEachPage(bodyHtml, categoryId) {
  var $ = _cheerio["default"].load(bodyHtml);

  $('.product-header').each(function (_, elm) {
    var id = getLastPart($(elm).find('.product-image-link').attr('href').toString());
    var name = $(elm).find('.product-name').text().trim();
    var brand = $(elm).find('.product-brand').text().trim();
    var imageUrls = [getImageUrl(_colesVariables.colesUrl + $(elm).find('.product-image img').attr('src').toString())];
    var storeId = 'coles';
    var packageSize = $(elm).find('.product-info .package-size').text().trim();
    var cupPrice = $(elm).find('.product-info .package-price').text().trim();
    var price = Number($(elm).find('.dollar-value').text().trim() + $(elm).find('.cent-value').text().trim());
    var promo = getPromoText($(elm).find('.discount-text').text().trim());
    var orgPrice = price + getSaveValue($(elm).find('.product-save-value').text().trim());
    var localPrice = {
      price: price,
      discountRate: getDiscountRate(price, orgPrice, promo),
      promo: promo,
      orgPrice: orgPrice
    };
    var locations = {};
    locations[currentLocation] = localPrice;
    var categoryIds = [categoryId];
    var foundIndex = PRODUCTS.findIndex(function (p) {
      return p.id === id;
    });

    if (foundIndex > -1) {
      if (!Object.keys(PRODUCTS[foundIndex].locations).includes(currentLocation)) {
        PRODUCTS[foundIndex].locations[currentLocation] = localPrice;
      }

      if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
        PRODUCTS[foundIndex].categoryIds.push(categoryId);
        PRODUCTS[foundIndex].categoryIds = (0, _toConsumableArray2["default"])(new Set(PRODUCTS[foundIndex].categoryIds));
      }

      console.log(PRODUCTS[foundIndex]);
    } else {
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
        similarProductIds: []
      };
      console.log(newProduct);
      PRODUCTS.push(newProduct);
    }
  });
};

var getDiscountRate = function getDiscountRate(price, orgPrice, promo) {
  var rate;

  if (orgPrice) {
    rate = Math.round(100 - price / orgPrice * 100);
  }

  if (promo.trim() !== '') {
    var parts = promo.trim().split(' ');
    var quantity = null;
    var amount = null;

    var _iterator = _createForOfIteratorHelper(parts),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;

        if (!isNaN(part)) {
          quantity = Number(part);
        }

        if (part[0] === '$') {
          amount = Number(part.replace('$', ''));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (quantity && amount) {
      var one = amount / quantity;
      rate = Math.round(100 - one / price * 100);
    }
  }

  return rate;
};

var getLastPart = function getLastPart(str) {
  var parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

var getCategoryId = function getCategoryId(str) {
  return 'c-' + str.toLowerCase().trim().replace('&', '').replace(',', '').replace(/\s/g, '-');
};

var getPromoText = function getPromoText(str) {
  var polishedStr = str.replace(/\n/g, '').replace(/\t/g, '');
  var parts = polishedStr.split('$');
  return polishedStr.replace(parts[0], parts[0] + ' ').trim();
};

var getImageUrl = function getImageUrl(str) {
  return str.replace('-th.', '.');
};

var getSaveValue = function getSaveValue(str) {
  return Number(str.replace('$', ''));
};

var _default = fetchColesSpecial;
exports["default"] = _default;