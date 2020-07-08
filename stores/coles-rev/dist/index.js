"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _getAllColesProducts = _interopRequireDefault(require("./actions/getAllColesProducts"));

var _getCategorisedColesProducts = _interopRequireDefault(require("./actions/getCategorisedColesProducts"));

var _playground = require("./playground");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Actions
var GET_ALL_COLES_PRODUCTS = 'get_coles_products';
var GET_PRODUCTS_FROM_COLES_CATEGORY = 'get_products_from_coles_category';
var PLAYGROUND = 'playground';
var EXIT = 'exit';
var choices = [{
  title: 'Get all products of one category of Coles',
  action: GET_PRODUCTS_FROM_COLES_CATEGORY
}, {
  title: 'Get all products from Coles',
  action: GET_ALL_COLES_PRODUCTS
}, {
  title: 'Playground',
  action: PLAYGROUND
}, {
  title: 'Exit',
  action: EXIT
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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(answers) {
    var urls, _iterator, _step, url, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = answers.action;
            _context.next = _context.t0 === GET_PRODUCTS_FROM_COLES_CATEGORY ? 3 : _context.t0 === GET_ALL_COLES_PRODUCTS ? 22 : _context.t0 === PLAYGROUND ? 24 : _context.t0 === EXIT ? 27 : 28;
            break;

          case 3:
            // inquirer
            //   .prompt([
            //     {
            //       type: 'input',
            //       name: 'url',
            //       message: 'Category URL:',
            //     },
            //   ])
            //   .then((subAns) => {
            //     getCategorisedColesProducts(subAns.url);
            //   });
            urls = (0, _playground.readLineFromFile)('./data/urls.txt');
            _iterator = _createForOfIteratorHelper(urls);
            _context.prev = 5;

            _iterator.s();

          case 7:
            if ((_step = _iterator.n()).done) {
              _context.next = 13;
              break;
            }

            url = _step.value;
            _context.next = 11;
            return (0, _getCategorisedColesProducts["default"])(url);

          case 11:
            _context.next = 7;
            break;

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t1 = _context["catch"](5);

            _iterator.e(_context.t1);

          case 18:
            _context.prev = 18;

            _iterator.f();

            return _context.finish(18);

          case 21:
            return _context.abrupt("return");

          case 22:
            (0, _getAllColesProducts["default"])();
            return _context.abrupt("return");

          case 24:
            data = (0, _playground.readLineFromFile)('./data/urls.txt');
            console.log(data);
            return _context.abrupt("return");

          case 27:
            return _context.abrupt("return");

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 15, 18, 21]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());