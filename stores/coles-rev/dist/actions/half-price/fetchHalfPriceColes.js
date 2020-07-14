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

var _variables = require("../../variables");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*
"id": "c2815617p-9334169000092",
"store": "coles",
"name": "Wholegrain Large Wraps 8 pack",
"brand": "Simson's Pantry",
"price": 2.1,
"orgPrice": 4.2,
"categoryIds": ["bakery"],
"imagePath": "https://shop.coles.com.au/wcsstore/Coles-CAS/images/2/8/1/2815617.jpg",
"cupPrice": "$0.38 per 100g",
"packageSize": "560g",
"isAvailable": true,
"locations": ["vic", "sa", "qld", "nsw", "wa", "tas", "act", "nt"]
*/
var categoryNames = ['Bread & Bakery', 'Dairy, Eggs & Meals', 'Meat, Seafood & Deli', 'Pantry', 'Frozen', 'Drinks', 'International Foods', 'Healthy Living', 'Household', 'Health & Beauty', 'Baby'];
var products = [];
var currentLocation = '';

var fetchHalfPriceColes = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _iterator, _step, location;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(_variables.colesLocations);
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
            _fs["default"].writeFileSync("./data/products/half-price-coles.json", JSON.stringify(products));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 12, 15, 18]]);
  }));

  return function fetchHalfPriceColes() {
    return _ref.apply(this, arguments);
  };
}();

var fetchEachLocation = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(location) {
    var postcode, url, browser, page, bodyHtml, $, categories, i, categoryName, categoryUrl, categoryId;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            postcode = location.postcode;
            url = location.url;
            console.log("Getting hal-price products from ".concat(location.id.toUpperCase()));
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
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 13:
            _context2.next = 15;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 15:
            _context2.next = 17;
            return page.waitFor(1000);

          case 17:
            _context2.next = 19;
            return page.click('#changeLocationBar');

          case 19:
            _context2.next = 21;
            return page.waitFor(1000);

          case 21:
            _context2.next = 23;
            return page.type('#search-form > p', postcode);

          case 23:
            _context2.next = 25;
            return page.waitFor(1000);

          case 25:
            _context2.next = 27;
            return page.keyboard.press('Enter');

          case 27:
            _context2.next = 29;
            return page.waitForNavigation({
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 29:
            _context2.next = 31;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 31:
            _context2.next = 33;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 33:
            bodyHtml = _context2.sent;
            $ = _cheerio["default"].load(bodyHtml);
            categories = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'));
            i = 0;

          case 37:
            if (!(i < categories.length)) {
              _context2.next = 47;
              break;
            }

            categoryName = categories[i].children[0].data;

            if (!categoryNames.includes(categoryName)) {
              _context2.next = 44;
              break;
            }

            categoryUrl = _variables.colesUrl + categories[i].parent.parent.attribs.href;
            categoryId = getCategoryId(categoryName);
            _context2.next = 44;
            return fetchCategoryProducts(categoryUrl, categoryId, page);

          case 44:
            i++;
            _context2.next = 37;
            break;

          case 47:
            _context2.next = 49;
            return browser.close();

          case 49:
            _fs["default"].writeFileSync("./data/products/half-price-coles-".concat(location.id, ".json"), JSON.stringify(products));

            _context2.next = 56;
            break;

          case 52:
            _context2.prev = 52;
            _context2.t0 = _context2["catch"](3);
            console.log(_context2.t0);
            return _context2.abrupt("return");

          case 56:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 52]]);
  }));

  return function fetchEachLocation(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchCategoryProducts = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(categoryUrl, categoryId, page) {
    var bodyHtml, totalPages, urls, _iterator2, _step2, url;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return page["goto"](categoryUrl, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 2:
            _context3.next = 4;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 4:
            bodyHtml = _context3.sent;
            totalPages = getTotalPages(bodyHtml);

            if (!(totalPages >= 1)) {
              _context3.next = 27;
              break;
            }

            urls = getPaginationUrls(categoryUrl, totalPages);
            _iterator2 = _createForOfIteratorHelper(urls);
            _context3.prev = 9;

            _iterator2.s();

          case 11:
            if ((_step2 = _iterator2.n()).done) {
              _context3.next = 17;
              break;
            }

            url = _step2.value;
            _context3.next = 15;
            return fetchProductsEachPage(page, url, categoryId);

          case 15:
            _context3.next = 11;
            break;

          case 17:
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](9);

            _iterator2.e(_context3.t0);

          case 22:
            _context3.prev = 22;

            _iterator2.f();

            return _context3.finish(22);

          case 25:
            _context3.next = 29;
            break;

          case 27:
            _context3.next = 29;
            return fetchProductsEachPage(page, categoryUrl, categoryId);

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 19, 22, 25]]);
  }));

  return function fetchCategoryProducts(_x2, _x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var getTotalPages = function getTotalPages(bodyHtml) {
  var $ = _cheerio["default"].load(bodyHtml);

  var totalPages = 0;

  try {
    totalPages = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data);
  } catch (err) {
    totalPages = 1;
  }

  return totalPages;
};

var getPaginationUrls = function getPaginationUrls(url, pageNumber) {
  var urls = [];
  var urlWithoutPage = url.substring(0, url.length - 1);

  for (var i = 1; i <= pageNumber; i++) {
    urls.push("".concat(urlWithoutPage).concat(String(i)));
  }

  return urls;
};

var fetchProductsEachPage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(page, url, categoryId) {
    var bodyHtml, $;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return page["goto"](url, {
              timeout: 0,
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
            $('.product-header').each(function (i, elm) {
              var id = getProductId($(elm).find('.product-image-link').attr('href').toString());
              var name = $(elm).find('.product-name').text().trim();
              var imageUrl = getImageUrl(_variables.colesUrl + $(elm).find('.product-image img').attr('src').toString());
              var brand = $(elm).find('.product-brand').text().trim();
              var packageSize = $(elm).find('.product-info .package-size').text().trim();
              var cupPrice = $(elm).find('.product-info .package-price').text().trim();
              var price = Number($(elm).find('.dollar-value').text().trim() + $(elm).find('.cent-value').text().trim());
              var orgPrice = price + getSaveValue($(elm).find('.product-save-value').text().trim());

              if (products.some(function (p) {
                return p.id === id;
              })) {
                products.map(function (p) {
                  if (p.id === id && !p.locations.includes(currentLocation)) {
                    p.locations.push(currentLocation);
                    p.locations = (0, _toConsumableArray2["default"])(new Set(p.locations));
                  }

                  if (p.id === id && !p.categoryIds.includes(categoryId)) {
                    p.categoryIds.push(categoryId);
                    p.categoryIds = (0, _toConsumableArray2["default"])(new Set(p.categoryIds));
                  }
                });
              } else {
                var newProduct = {
                  id: id,
                  store: 'coles',
                  brand: brand,
                  name: name,
                  price: price,
                  orgPrice: orgPrice,
                  imagePath: imageUrl,
                  categoryIds: [categoryId],
                  packageSize: packageSize,
                  cupPrice: cupPrice,
                  isAvailable: true,
                  locations: [currentLocation]
                };
                console.log(newProduct);
                products.push(newProduct);
              }
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchProductsEachPage(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var getProductId = function getProductId(str) {
  var parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

var getSaveValue = function getSaveValue(str) {
  return Number(str.replace('$', ''));
};

var getImageUrl = function getImageUrl(str) {
  return str.replace('-th.', '.');
};

var getCategoryId = function getCategoryId(categoryName) {
  switch (categoryName) {
    case 'Bread & Bakery':
      return 'bakery';

    case 'Meat, Seafood & Deli':
      return 'meat-seafood-deli';

    case 'Dairy, Eggs & Meals':
      return 'dairy-eggs-fridge';

    case 'Pantry':
      return 'pantry';

    case 'Frozen':
      return 'freezer';

    case 'Drinks':
      return 'drinks';

    case 'Pet':
      return 'pet';

    case 'Household':
      return 'household';

    case 'International Foods':
      return 'international-foods';

    case 'Baby':
      return 'baby';

    case 'Healthy Living':
    case 'Health & Beauty':
      return 'health-beauty';

    default:
      return 'uncategorised';
  }
};

var _default = fetchHalfPriceColes;
exports["default"] = _default;