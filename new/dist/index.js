"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fetchColesSpecial = _interopRequireDefault(require("./functions/fetchColesSpecial"));

var EXIT = 'exit';
var GET_SPECIAL_PRODUCTS = 'get_special_prices';
var choices = [{
  title: 'Get special products',
  action: GET_SPECIAL_PRODUCTS
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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(answers) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = answers.action;
            _context2.next = _context2.t0 === GET_SPECIAL_PRODUCTS ? 3 : _context2.t0 === EXIT ? 5 : 6;
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
                        _context.next = _context.t0 === 'coles' ? 3 : _context.t0 === 'woolworths' ? 6 : _context.t0 === 'chemist' ? 8 : 10;
                        break;

                      case 3:
                        _context.next = 5;
                        return (0, _fetchColesSpecial["default"])();

                      case 5:
                        return _context.abrupt("return");

                      case 6:
                        console.log('Fetching Woolworths');
                        return _context.abrupt("return");

                      case 8:
                        console.log('Fetching Chemist Warehouse');
                        return _context.abrupt("return");

                      case 10:
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
            return _context2.abrupt("return");

          case 6:
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