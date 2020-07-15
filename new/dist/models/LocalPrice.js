"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var LocalPrice = function LocalPrice(price, promo, orgPrice) {
  (0, _classCallCheck2["default"])(this, LocalPrice);
  this.price = price;
  this.promo = promo;
  this.orgPrice = orgPrice;
};

exports["default"] = LocalPrice;