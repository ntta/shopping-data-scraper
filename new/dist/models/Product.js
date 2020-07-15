"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var Product = function Product(id, name, brand, imageUrls, storeId, packageSize, cupPrice, locations, productCategories, similarProductIds) {
  (0, _classCallCheck2["default"])(this, Product);
  this.id = id;
  this.name = name;
  this.brand = brand;
  this.imageUrls = imageUrls;
  this.storeId = storeId;
  this.packageSize = packageSize;
  this.cupPrice = cupPrice;
  this.locations = locations;
  this.productCategories = productCategories;
  this.similarProductIds = similarProductIds;
};

exports["default"] = Product;