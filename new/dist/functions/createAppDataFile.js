"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireDefault(require("fs"));

var _colesVariables = require("../variables/colesVariables");

var _woolworthsVariables = require("../variables/woolworthsVariables");

var _chemistVariables = require("../variables/chemistVariables");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var createAppDataFile = function createAppDataFile(store, uploadDate, fromDate, toDate) {
  var appData = {
    version: {
      'upload-date': uploadDate,
      'from-date': fromDate,
      'to-date': toDate
    }
  };
  var filename = '';

  switch (store) {
    case 'coles':
      appData = {
        coles: _objectSpread(_objectSpread({}, appData), {}, {
          products: JSON.parse(_fs["default"].readFileSync(_colesVariables.colesProductsPath)),
          categories: JSON.parse(_fs["default"].readFileSync(_colesVariables.colesCategoriesPath))
        })
      };
      filename = 'coles.json';
      break;

    case 'woolworths':
      appData = {
        woolworths: _objectSpread(_objectSpread({}, appData), {}, {
          products: JSON.parse(_fs["default"].readFileSync(_woolworthsVariables.woolworthsProductsPath)),
          categories: JSON.parse(_fs["default"].readFileSync(_woolworthsVariables.woolworthsCategoriesPath))
        })
      };
      filename = 'woolworths.json';
      break;

    case 'chemist-warehouse':
      appData = {
        'chemist-warehouse': _objectSpread(_objectSpread({}, appData), {}, {
          products: JSON.parse(_fs["default"].readFileSync(_chemistVariables.chemistWarehouseProductsPath)),
          categories: JSON.parse(_fs["default"].readFileSync(_chemistVariables.chemistWarehouseCategoriesPath))
        })
      };
      filename = 'chemist-warehouse.json';
      break;
  }

  _fs["default"].writeFileSync("./data/".concat(filename), JSON.stringify(appData));
};

var _default = createAppDataFile;
exports["default"] = _default;