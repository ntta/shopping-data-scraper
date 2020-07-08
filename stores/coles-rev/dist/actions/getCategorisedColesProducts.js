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

var _variables = require("../variables");

/* Get all products from Coles
 * 1. Navigate to colesEverything.url and enter its postcode to ensure location is correct
 * 2. Get all category URLs (not in ignoredCategoryList) from the left column
 * 3. Navigate to each URL, get products in each page
 * Product object format:
 * {
 *  id: string,
 *  brand: string,
 *  name: string,
 *  imageUrl: string,
 *  categories: Array of string,
 *  locations: {
 *    vic: {
 *      price: double,
 *      promoText: string,
 *      package-size: string,
 *      package-price: string,
 *    }
 *  }
 * }
 */
var postcode = _variables.colesEverything.postcode;
var allProducts = [];

var getCategorisedColesProducts = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var browser, page, category;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _puppeteerExtra["default"].use((0, _puppeteerExtraPluginStealth["default"])());

            _context.next = 4;
            return _puppeteerExtra["default"].launch({
              headless: false
            });

          case 4:
            browser = _context.sent;
            _context.next = 7;
            return browser.newPage();

          case 7:
            page = _context.sent;
            category = getProductCategory(url);
            console.log("Getting products from ".concat(category)); // Navigate to url and enter postcode

            _context.next = 12;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 12:
            _context.next = 14;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 14:
            _context.next = 16;
            return page.click('#changeLocationBar');

          case 16:
            _context.next = 18;
            return page.waitFor(1000);

          case 18:
            _context.next = 20;
            return page.type('#search-form > p', postcode.toString());

          case 20:
            _context.next = 22;
            return page.waitFor(1000);

          case 22:
            _context.next = 24;
            return page.keyboard.press('Enter');

          case 24:
            _context.next = 26;
            return page.waitForNavigation({
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 26:
            _context.next = 28;
            return getDeepestSubCategoryList(page, url);

          case 28:
            _context.next = 30;
            return browser.close();

          case 30:
            _fs["default"].writeFileSync("./data/products/".concat(category, ".json"), JSON.stringify(allProducts));

            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return");

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 33]]);
  }));

  return function getCategorisedColesProducts(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getDeepestSubCategoryList = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(page, url) {
    var bodyHtml, $, categoryList, i;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return page["goto"](url, {
              timeout: 0,
              waitUntil: 'networkidle2'
            });

          case 2:
            _context2.next = 4;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 4:
            bodyHtml = _context2.sent;
            $ = _cheerio["default"].load(bodyHtml);
            categoryList = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'));

            if (!(categoryList.length > 0)) {
              _context2.next = 19;
              break;
            }

            i = 0;

          case 9:
            if (!(i < categoryList.length)) {
              _context2.next = 17;
              break;
            }

            if (!_variables.ignoredCategoryList.includes(categoryList[i].children[0].data)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("continue", 14);

          case 12:
            _context2.next = 14;
            return getDeepestSubCategoryList(page, _variables.colesUrl + categoryList[i].parent.parent.attribs.href);

          case 14:
            i++;
            _context2.next = 9;
            break;

          case 17:
            _context2.next = 21;
            break;

          case 19:
            _context2.next = 21;
            return getProductsOfCategory(page, url);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getDeepestSubCategoryList(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getProductsOfCategory = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(page, url) {
    var bodyHtml, $, pageNumber, urls, i;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return page["goto"](url, {
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
            $ = _cheerio["default"].load(bodyHtml);
            pageNumber = 0;

            try {
              pageNumber = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data);
            } catch (err) {
              pageNumber = 1;
            }

            urls = getPaginationUrls(url, pageNumber);
            i = 0;

          case 10:
            if (!(i < urls.length)) {
              _context3.next = 17;
              break;
            }

            console.log("Getting: ".concat(urls[i]));
            _context3.next = 14;
            return getProductsEachPage(page, urls[i]);

          case 14:
            i++;
            _context3.next = 10;
            break;

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getProductsOfCategory(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var getProductsEachPage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(page, url) {
    var bodyHtml, $, category, tags;
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
            category = getProductCategory(url);
            tags = getProductTags(url);
            console.log(tags);
            $('.product-header').each(function (i, elm) {
              var id = getProductId($(elm).find('.product-image-link').attr('href').toString());
              var name = $(elm).find('.product-name').text().trim();
              var imageUrl = _variables.colesUrl + $(elm).find('.product-image img').attr('src').toString();
              var brand = $(elm).find('.product-brand').text().trim();
              var packageSize = $(elm).find('.product-info .package-size').text().trim();
              var packagePrice = $(elm).find('.product-info .package-price').text().trim();
              var price = Number($(elm).find('.dollar-value').text().trim() + $(elm).find('.cent-value').text().trim());
              var promoText = $(elm).find('.product-save-value').text().trim() + getDiscountText($(elm).find('.discount-text').text().trim());

              if (allProducts.some(function (p) {
                return p.id === id;
              })) {
                allProducts.map(function (p) {
                  if (p.id === id) {
                    p.categories.push(category);
                    p.categories = (0, _toConsumableArray2["default"])(new Set(p.categories));
                    p.tags.concat(tags);
                    p.tags = (0, _toConsumableArray2["default"])(new Set(p.tags));
                  }
                });
              } else {
                var categories = [category];
                var newProduct = {
                  id: id,
                  brand: brand,
                  name: name,
                  imageUrl: imageUrl,
                  categories: categories,
                  tags: tags,
                  locations: {
                    vic: {
                      price: price,
                      promoText: promoText,
                      packageSize: packageSize,
                      packagePrice: packagePrice
                    }
                  }
                };
                console.log(newProduct);
                allProducts.push(newProduct);
              }
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getProductsEachPage(_x6, _x7) {
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

var getProductId = function getProductId(str) {
  var parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

var getProductCategory = function getProductCategory(str) {
  var parts = str.split('/');
  var result = '';

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse') {
      result = parts[i + 1];
      break;
    }
  }

  return result.split('?')[0];
};

var getDiscountText = function getDiscountText(str) {
  var polishedStr = str.replace(/\n/g, '').replace(/\t/g, '');
  var parts = polishedStr.split('$');
  return polishedStr.replace(parts[0], parts[0] + ' ');
};

var getProductTags = function getProductTags(str) {
  var parts = str.split('/');
  var result = [];

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse' && i + 1 < parts.length) {
      result = parts.slice(parts.indexOf(parts[i + 1]), parts.length);
      break;
    }
  }

  var category = getProductCategory(str);
  result = result.filter(function (tag) {
    return tag !== category;
  });
  return result.map(function (tag) {
    return tag.split('?')[0];
  });
};

var _default = getCategorisedColesProducts;
exports["default"] = _default;