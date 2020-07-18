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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _iterator, _step, location;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(_colesVariables.colesLocations);
            _context.prev = 1;

            _iterator.s();

          case 3:
            if ((_step = _iterator.n()).done) {
              _context.next = 10;
              break;
            }

            location = _step.value;
            currentLocation = location.id;
            _context.next = 8;
            return fetchEachLocation(location);

          case 8:
            _context.next = 3;
            break;

          case 10:
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);

            _iterator.e(_context.t0);

          case 15:
            _context.prev = 15;

            _iterator.f();

            return _context.finish(15);

          case 18:
            _fs["default"].writeFileSync(_colesVariables.colesProductsPath, JSON.stringify(PRODUCTS));

            _fs["default"].writeFileSync(_colesVariables.colesCategoriesPath, JSON.stringify(CATEGORIES));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 12, 15, 18]]);
  }));

  return function fetchColesSpecial() {
    return _ref.apply(this, arguments);
  };
}(); // const fetchColesSpecial = async (locationId) => {
//   let location = colesLocations.find((l) => l.id === locationId);
//   currentLocation = locationId;
//   await fetchEachLocation(location);
//   fs.writeFileSync(
//     `./data/products/coles-special-products-${locationId}.json`,
//     JSON.stringify(PRODUCTS)
//   );
//   fs.writeFileSync(
//     `./data/products/coles-special-categories-${locationId}.json`,
//     JSON.stringify(CATEGORIES)
//   );
// };


var ensureCorrectUrl = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(page, url, location) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (page.url().includes(location.area)) {
              _context2.next = 21;
              break;
            }

            _context2.next = 3;
            return page["goto"](url, {
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
              waitUntil: 'networkidle2'
            });

          case 15:
            _context2.next = 17;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 17:
            _context2.next = 19;
            return page.waitFor(5000);

          case 19:
            _context2.next = 0;
            break;

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function ensureCorrectUrl(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchEachLocation = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(location) {
    var url, browser, page, error;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = location.url;
            console.log("Getting special products from ".concat(location.id));

            _puppeteerExtra["default"].use((0, _puppeteerExtraPluginStealth["default"])());

            _context3.next = 5;
            return _puppeteerExtra["default"].launch({
              headless: true
            });

          case 5:
            browser = _context3.sent;
            _context3.next = 8;
            return browser.newPage();

          case 8:
            page = _context3.sent;
            error = true;

          case 10:
            if (!error) {
              _context3.next = 27;
              break;
            }

            _context3.prev = 11;
            _context3.next = 14;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 14:
            _context3.next = 16;
            return ensureCorrectUrl(page, url, location);

          case 16:
            _context3.next = 18;
            return fetchProducts(page, url, location);

          case 18:
            error = false;
            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](11);
            console.log('Failed in fetchEachLocation. Trying again...');
            error = true;

          case 25:
            _context3.next = 10;
            break;

          case 27:
            _context3.next = 29;
            return browser.close();

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[11, 21]]);
  }));

  return function fetchEachLocation(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchProducts = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(page, url, location) {
    var error, bodyHtml, $, categoryList, i;
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
            error = true;

          case 6:
            if (!error) {
              _context5.next = 19;
              break;
            }

            _context5.prev = 7;
            _context5.next = 10;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 10:
            error = false;
            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](7);
            console.log('Failed in fetchProducts. Trying again...');
            error = true;

          case 17:
            _context5.next = 6;
            break;

          case 19:
            _context5.next = 21;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 21:
            bodyHtml = _context5.sent;
            $ = _cheerio["default"].load(bodyHtml);
            categoryList = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'));

            if (!(categoryList.length > 0)) {
              _context5.next = 32;
              break;
            }

            i = 0;

          case 26:
            if (!(i < categoryList.length)) {
              _context5.next = 32;
              break;
            }

            if (_colesVariables.categoryBlacklist.includes(categoryList[i].children[0].data)) {
              _context5.next = 29;
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
            })(), "t1", 29);

          case 29:
            i++;
            _context5.next = 26;
            break;

          case 32:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[7, 13]]);
  }));

  return function fetchProducts(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var fetchProductsOfCategory = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(page, url, categoryId) {
    var error, bodyHtml, $, pageNumber, urls, i, html;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            error = true;

          case 1:
            if (!error) {
              _context6.next = 16;
              break;
            }

            _context6.prev = 2;
            _context6.next = 5;
            return page["goto"](url, {
              waitUntil: 'networkidle2'
            });

          case 5:
            _context6.next = 7;
            return page.waitForSelector('.product-name', {
              visible: true
            });

          case 7:
            error = false;
            _context6.next = 14;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](2);
            console.log("Failed to get: ".concat(url, ". Trying again..."));
            error = true;

          case 14:
            _context6.next = 1;
            break;

          case 16:
            _context6.next = 18;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 18:
            bodyHtml = _context6.sent;
            $ = _cheerio["default"].load(bodyHtml);
            pageNumber = 0;

            try {
              pageNumber = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data);
            } catch (_) {
              pageNumber = 1;
            }

            urls = getPaginationUrls(url, pageNumber);
            console.log(url);
            getProductsEachPage(bodyHtml, categoryId);

            if (!(urls.length > 1)) {
              _context6.next = 52;
              break;
            }

            i = 1;

          case 27:
            if (!(i < urls.length)) {
              _context6.next = 52;
              break;
            }

            error = true;

          case 29:
            if (!error) {
              _context6.next = 44;
              break;
            }

            _context6.prev = 30;
            _context6.next = 33;
            return page["goto"](urls[i], {
              waitUntil: 'networkidle2'
            });

          case 33:
            _context6.next = 35;
            return page.waitForSelector('.product-name', {
              visible: true
            });

          case 35:
            error = false;
            _context6.next = 42;
            break;

          case 38:
            _context6.prev = 38;
            _context6.t1 = _context6["catch"](30);
            console.log("Failed to get: ".concat(urls[i], ". Trying again..."));
            error = true;

          case 42:
            _context6.next = 29;
            break;

          case 44:
            _context6.next = 46;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 46:
            html = _context6.sent;
            console.log(urls[i]);
            getProductsEachPage(html, categoryId);

          case 49:
            i++;
            _context6.next = 27;
            break;

          case 52:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 10], [30, 38]]);
  }));

  return function fetchProductsOfCategory(_x8, _x9, _x10) {
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

  var count = 0;
  $('.product-header').each(function (_, elm) {
    count++;
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
      PRODUCTS.push(newProduct);
    }
  });
  console.log("Count: ".concat(count));
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

    var _iterator2 = _createForOfIteratorHelper(parts),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var part = _step2.value;

        if (!isNaN(part)) {
          quantity = Number(part);
        }

        if (part[0] === '$') {
          amount = Number(part.replace('$', ''));
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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