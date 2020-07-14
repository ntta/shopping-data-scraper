"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteerExtra = _interopRequireDefault(require("puppeteer-extra"));

var _puppeteerExtraPluginStealth = _interopRequireDefault(require("puppeteer-extra-plugin-stealth"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _fs = _interopRequireDefault(require("fs"));

var _variables = require("../variables");

var BLACKLIST = ['prescriptions', 'travel-medicine-tma-b2b-products-only'];

var getChemistCategories = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var browser, page, bodyHtml, $, allUrls;
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
            _context.next = 10;
            return page["goto"](_variables.chemistCategoriesUrl, {
              waitUntil: 'domcontentloaded'
            });

          case 10:
            _context.next = 12;
            return page.evaluate(function () {
              return document.body.innerHTML;
            });

          case 12:
            bodyHtml = _context.sent;
            $ = _cheerio["default"].load(bodyHtml);
            allUrls = [];
            $('#p_lt_ctl09_pageplaceholder_p_lt_ctl00_wCM_AMS_tg_tvn0Nodes').children('table').each(function (i, elm) {
              var categoryUrl = _variables.chemistUrl + $(elm).find('.CategoryTreeItem').find('a').attr('href').toString();
              var categoryId = getCategoryId(categoryUrl);
              var categoryNumber = getCategoryNumber(categoryUrl);
              var categoryName = $(elm).find('.CategoryTreeItem').find('.Name').text().toString().trim();
              var subCategories = [];

              if (!BLACKLIST.includes(categoryId) && $(elm).next().has('div')) {
                $(elm).next().children('table').each(function (subI, subElm) {
                  var subCategoryUrl = _variables.chemistUrl + $(subElm).find('.CategoryTreeItem').find('a').attr('href').toString();
                  var subCategoryId = getCategoryId(subCategoryUrl);
                  var subCategoryNumber = getCategoryNumber(subCategoryUrl);
                  var subCategoryName = $(subElm).find('.CategoryTreeItem').find('.Name').text().toString().trim();
                  subCategories.push({
                    categoryNumber: subCategoryNumber,
                    subCategoryId: subCategoryId,
                    subCategoryName: subCategoryName,
                    subCategoryUrl: subCategoryUrl
                  });
                });
              }

              allUrls.push({
                categoryId: categoryId,
                categoryName: categoryName,
                categoryUrl: categoryUrl,
                subCategories: subCategories
              });
            });

            _fs["default"].writeFileSync('./data/chemist-category-urls.json', JSON.stringify(allUrls));

            _context.next = 19;
            return browser.close();

          case 19:
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return");

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 21]]);
  }));

  return function getChemistCategories() {
    return _ref.apply(this, arguments);
  };
}();

var getCategoryId = function getCategoryId(str) {
  var parts = str.split('/');
  return parts[parts.length - 1];
};

var getCategoryNumber = function getCategoryNumber(str) {
  var parts = str.split('/');
  return parts[parts.length - 2];
};

var _default = getChemistCategories;
exports["default"] = _default;