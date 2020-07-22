"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var colesProductsPath = './data/products/half-price/coles-half-price-products.json';
var colesCategoriesPath = './data/products/half-price/coles-half-price-categories.json';
var woolworthsProductsPath = './data/products/half-price/woolworths-half-price-products.json';
var woolworthsCategoriesPath = './data/products/half-price/woolworths-half-price-categories.json';
var chemistWarehouseProductsPath = './data/products/half-price/chemist-warehouse-half-price-products.json';
var chemistWarehouseCategoriesPath = './data/products/half-price/chemist-warehouse-half-price-categories.json';

var createStoreDataFile = function createStoreDataFile(storeId) {
  var storeData = {};
  var filename = '';

  switch (storeId) {
    case 'coles':
      storeData = {
        products: JSON.parse(_fs["default"].readFileSync(colesProductsPath)),
        categories: JSON.parse(_fs["default"].readFileSync(colesCategoriesPath))
      };
      filename = 'coles.json';
      break;

    case 'woolworths':
      storeData = {
        products: JSON.parse(_fs["default"].readFileSync(woolworthsProductsPath)),
        categories: JSON.parse(_fs["default"].readFileSync(woolworthsCategoriesPath))
      };
      filename = 'woolworths.json';
      break;

    case 'chemist-warehouse':
      storeData = {
        products: JSON.parse(_fs["default"].readFileSync(chemistWarehouseProductsPath)),
        categories: JSON.parse(_fs["default"].readFileSync(chemistWarehouseCategoriesPath))
      };
      filename = 'chemist-warehouse.json';
      break;
  }

  _fs["default"].writeFileSync("./data/".concat(filename), JSON.stringify(storeData));
};

var _default = createStoreDataFile;
exports["default"] = _default;