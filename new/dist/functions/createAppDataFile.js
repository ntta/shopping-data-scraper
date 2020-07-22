"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var coles = JSON.parse(_fs["default"].readFileSync('./data/coles.json'));
var woolworths = JSON.parse(_fs["default"].readFileSync('./data/woolworths.json'));
var chemistWarehouse = JSON.parse(_fs["default"].readFileSync('./data/chemist-warehouse.json'));

var createAppDataFile = function createAppDataFile(uploadDate, fromDate, toDate) {
  var appData = {
    'store-version': {
      coles: {
        name: 'Coles',
        isAvailable: true,
        uploadDate: uploadDate,
        fromDate: fromDate,
        toDate: toDate
      },
      woolworths: {
        name: 'Woolworths',
        isAvailable: true,
        uploadDate: uploadDate,
        fromDate: fromDate,
        toDate: toDate
      },
      'chemist-warehouse': {
        name: 'Chemist Warehouse',
        isAvailable: true,
        uploadDate: uploadDate,
        fromDate: fromDate,
        toDate: toDate
      }
    },
    'store-data': {
      coles: coles,
      woolworths: woolworths,
      'chemist-warehouse': chemistWarehouse
    }
  };

  _fs["default"].writeFileSync("./data/app-data.json", JSON.stringify(appData));
};

var _default = createAppDataFile;
exports["default"] = _default;