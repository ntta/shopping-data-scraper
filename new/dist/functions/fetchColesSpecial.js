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
            _context.next = 3;
            return fetchEachLocation(location);

          case 3:
            // for (let location of colesLocations) {
            //   currentLocation = location.id;
            //   await fetchEachLocation(location);
            // }
            _fs["default"].writeFileSync("./data/products/coles-special-products-".concat(locationId, ".json"), JSON.stringify(PRODUCTS));

            _fs["default"].writeFileSync("./data/products/coles-special-categories-".concat(locationId, ".json"), JSON.stringify(CATEGORIES));

          case 5:
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

var fetchEachLocation = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(location) {
    var postcode, url, browser, page;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            postcode = location.postcode;
            url = location.url;
            console.log("Getting special products from ".concat(location.id));
            _context2.prev = 3;

            _puppeteerExtra["default"].use((0, _puppeteerExtraPluginStealth["default"])());

            _context2.next = 7;
            return _puppeteerExtra["default"].launch({
              headless: false
            });

          case 7:
            browser = _context2.sent;
            _context2.next = 10;
            return browser.newPage();

          case 10:
            page = _context2.sent;
            _context2.next = 13;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 13:
            if (page.url().includes(location.area)) {
              _context2.next = 30;
              break;
            }

            _context2.next = 16;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 16:
            _context2.next = 18;
            return page.click('#changeLocationBar');

          case 18:
            _context2.next = 20;
            return page.waitFor(1000);

          case 20:
            _context2.next = 22;
            return page.type('#search-form > p', postcode);

          case 22:
            _context2.next = 24;
            return page.waitFor(1000);

          case 24:
            _context2.next = 26;
            return page.keyboard.press('Enter');

          case 26:
            _context2.next = 28;
            return page.waitForNavigation({
              waitUntil: 'networkidle2'
            });

          case 28:
            _context2.next = 13;
            break;

          case 30:
            _context2.next = 32;
            return fetchProducts(page, url);

          case 32:
            _context2.next = 34;
            return browser.close();

          case 34:
            _context2.next = 40;
            break;

          case 36:
            _context2.prev = 36;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            return _context2.abrupt("return");

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 36]]);
  }));

  return function fetchEachLocation(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchProducts = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(page, url) {
    var bodyHtml, $, categoryList, i;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 2:
            _context4.next = 4;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 4:
            bodyHtml = _context4.sent;
            $ = _cheerio["default"].load(bodyHtml);
            categoryList = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'));

            if (!(categoryList.length > 0)) {
              _context4.next = 15;
              break;
            }

            i = 0;

          case 9:
            if (!(i < categoryList.length)) {
              _context4.next = 15;
              break;
            }

            if (_colesVariables.categoryBlacklist.includes(categoryList[i].children[0].data)) {
              _context4.next = 12;
              break;
            }

            return _context4.delegateYield( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              var href, categoryId, categoryName, foundCatIndex;
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      href = categoryList[i].parent.parent.attribs.href;
                      categoryId = getLastPart(href);
                      categoryName = categoryList[i].children[0].data;
                      foundCatIndex = CATEGORIES.findIndex(function (c) {
                        return c.id === categoryId;
                      });

                      if (foundCatIndex < 0) {
                        CATEGORIES.push({
                          id: categoryId,
                          name: categoryName
                        });
                      }

                      _context3.next = 7;
                      return fetchProductsOfCategory(page, _colesVariables.colesUrl + href);

                    case 7:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })(), "t0", 12);

          case 12:
            i++;
            _context4.next = 9;
            break;

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchProducts(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchProductsOfCategory = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(page, url) {
    var bodyHtml, $, pageNumber, urls, i, html;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 2:
            _context5.next = 4;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 4:
            bodyHtml = _context5.sent;
            $ = _cheerio["default"].load(bodyHtml);
            pageNumber = 0;

            try {
              pageNumber = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data);
            } catch (err) {
              pageNumber = 1;
            }

            urls = getPaginationUrls(url, pageNumber);
            getProductsEachPage(bodyHtml, url);

            if (!(urls.length > 1)) {
              _context5.next = 23;
              break;
            }

            i = 1;

          case 12:
            if (!(i < urls.length)) {
              _context5.next = 23;
              break;
            }

            _context5.next = 15;
            return page["goto"](urls[i], {
              waitUntil: 'networkidle2'
            });

          case 15:
            _context5.next = 17;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 17:
            html = _context5.sent;
            console.log(urls[i]);
            getProductsEachPage(html, urls[i]);

          case 20:
            i++;
            _context5.next = 12;
            break;

          case 23:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function fetchProductsOfCategory(_x5, _x6) {
    return _ref4.apply(this, arguments);
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

var getProductsEachPage = function getProductsEachPage(bodyHtml, url) {
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
    var categoryId = getCategoryId(url);
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
  var parts = str.split('/');
  var savedIndex = 0;

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse') {
      savedIndex = i + 1;
      break;
    }
  }

  var result = parts.slice(savedIndex, parts.length);
  result[result.length - 1] = result[result.length - 1].split('?')[0];
  return result.join('/');
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