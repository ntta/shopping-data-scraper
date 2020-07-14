"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fs = _interopRequireDefault(require("fs"));

var _fetchHalfPriceColes = _interopRequireDefault(require("./actions/half-price/fetchHalfPriceColes"));

var _fillCategoryIds = _interopRequireDefault(require("./actions/half-price/fillCategoryIds"));

var EXIT = 'exit';
var GET_HALF_PRICES = 'get_half_prices';
var FILL_CATEGORY_IDS = 'fill_category_ids';
var choices = [{
  title: 'Get half-price products',
  action: GET_HALF_PRICES
}, {
  title: 'Fill category IDs',
  action: FILL_CATEGORY_IDS
}, {
  title: 'Exit',
  action: EXIT
}];
var stores = [{
  name: 'Coles',
  id: 'coles'
}, {
  name: 'Woolworths',
  id: 'woolworths'
}];

_inquirer["default"].prompt([{
  type: 'list',
  name: 'action',
  message: 'Actions: ',
  choices: Object.values(choices).map(function (c) {
    return c.title;
  }),
  filter: function filter(val) {
    return choices.filter(function (c) {
      if (c.title === val) {
        return c.action;
      }
    })[0].action;
  }
}]).then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(answers) {
    var data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = answers.action;
            _context2.next = _context2.t0 === GET_HALF_PRICES ? 3 : _context2.t0 === FILL_CATEGORY_IDS ? 5 : _context2.t0 === EXIT ? 8 : 9;
            break;

          case 3:
            _inquirer["default"].prompt([{
              type: 'list',
              name: 'store',
              message: 'Store: ',
              choices: Object.values(stores).map(function (s) {
                return s.name;
              }),
              filter: function filter(val) {
                return stores.filter(function (s) {
                  if (s.name === val) {
                    return s.id;
                  }
                })[0].id;
              }
            }]).then( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(subAnswers) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.t0 = subAnswers.store;
                        _context.next = _context.t0 === 'coles' ? 3 : _context.t0 === 'woolworths' ? 6 : 7;
                        break;

                      case 3:
                        _context.next = 5;
                        return (0, _fetchHalfPriceColes["default"])();

                      case 5:
                        return _context.abrupt("return");

                      case 6:
                        return _context.abrupt("return");

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            return _context2.abrupt("return");

          case 5:
            data = _fs["default"].readFileSync('./data/products/half-price-coles.json', 'utf8');
            (0, _fillCategoryIds["default"])(JSON.parse(data));
            return _context2.abrupt("return");

          case 8:
            return _context2.abrupt("return");

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());