"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _getAllColesProducts = _interopRequireDefault(require("./actions/getAllColesProducts"));

// Actions
var GET_ALL_COLES_PRODUCTS = 'get_coles_products';
var choices = [{
  title: 'Get all products from Coles',
  action: GET_ALL_COLES_PRODUCTS
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
}]).then(function (answers) {
  switch (answers.action) {
    case GET_ALL_COLES_PRODUCTS:
      (0, _getAllColesProducts["default"])();
      return;
  }
});