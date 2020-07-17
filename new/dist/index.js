"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fetchColesSpecial = _interopRequireDefault(require("./functions/fetchColesSpecial"));

var _fetchWoolworthsSpecial = _interopRequireDefault(require("./functions/fetchWoolworthsSpecial"));

var _mergeProductsCategories = _interopRequireDefault(require("./functions/mergeProductsCategories"));

var EXIT = 'exit';
var GET_SPECIAL_PRODUCTS = 'get_special_prices';
var MERGE_PRODUCTS_CATEGORIES = 'merge_products_categories';
var choices = [{
  title: 'Get special products',
  action: GET_SPECIAL_PRODUCTS
}, {
  title: 'Merge Coles products & categories',
  action: MERGE_PRODUCTS_CATEGORIES
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
}, {
  name: 'Chemist Warehouse',
  id: 'chemist'
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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(answers) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = answers.action;
            _context3.next = _context3.t0 === GET_SPECIAL_PRODUCTS ? 3 : _context3.t0 === MERGE_PRODUCTS_CATEGORIES ? 5 : _context3.t0 === EXIT ? 7 : 8;
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
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(subAnswers) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = subAnswers.store;
                        _context2.next = _context2.t0 === 'coles' ? 3 : _context2.t0 === 'woolworths' ? 5 : _context2.t0 === 'chemist' ? 9 : 11;
                        break;

                      case 3:
                        _inquirer["default"].prompt([{
                          type: 'input',
                          name: 'location',
                          message: 'Enter Location: ',
                          "default": 'VIC'
                        }]).then( /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(subSubAnswers) {
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return (0, _fetchColesSpecial["default"])(subSubAnswers.location);

                                  case 2:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x3) {
                            return _ref3.apply(this, arguments);
                          };
                        }()); // fetchColesSpecial('VIC'),
                        // fetchColesSpecial('NSW'),
                        // fetchColesSpecial('QLD'),
                        // fetchColesSpecial('TAS'),
                        // fetchColesSpecial('WA'),
                        // fetchColesSpecial('SA'),
                        // fetchColesSpecial('ACT'),
                        // fetchColesSpecial('NT'),


                        return _context2.abrupt("return");

                      case 5:
                        console.log('Fetching Woolworths');
                        _context2.next = 8;
                        return (0, _fetchWoolworthsSpecial["default"])();

                      case 8:
                        return _context2.abrupt("return");

                      case 9:
                        console.log('Fetching Chemist Warehouse');
                        return _context2.abrupt("return");

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            return _context3.abrupt("return");

          case 5:
            (0, _mergeProductsCategories["default"])();
            return _context3.abrupt("return");

          case 7:
            return _context3.abrupt("return");

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());