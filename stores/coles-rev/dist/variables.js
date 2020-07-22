"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colesLocations = exports.chemistUrl = exports.chemistCategoriesUrl = exports.ignoredCategoryList = exports.colesUrl = exports.colesEverything = void 0;
var colesEverything = {
  url: 'https://shop.coles.com.au/a/richmond-south/everything/browse',
  postcode: 3000
};
exports.colesEverything = colesEverything;
var colesUrl = 'https://shop.coles.com.au';
exports.colesUrl = colesUrl;
var ignoredCategoryList = ['Liquor', 'Tobacco'];
exports.ignoredCategoryList = ignoredCategoryList;
var chemistCategoriesUrl = 'https://www.chemistwarehouse.com.au/categories';
exports.chemistCategoriesUrl = chemistCategoriesUrl;
var chemistUrl = 'https://www.chemistwarehouse.com.au';
exports.chemistUrl = chemistUrl;
var colesLocations = [{
  id: 'vic',
  url: 'https://shop.coles.com.au/a/richmond-south/specials/search/half-price-specials',
  postcode: '3000'
}, {
  id: 'sa',
  url: 'https://shop.coles.com.au/a/churchill-centre/specials/search/half-price-specials',
  postcode: '5000'
}, {
  id: 'qld',
  url: 'https://shop.coles.com.au/a/fairfield/specials/search/half-price-specials',
  postcode: '4000'
}, {
  id: 'nsw',
  url: 'https://shop.coles.com.au/a/alexandria/specials/search/half-price-specials',
  postcode: '2000'
}, {
  id: 'wa',
  url: 'https://shop.coles.com.au/a/dianella/specials/search/half-price-specials',
  postcode: '6000'
}, {
  id: 'tas',
  url: 'https://shop.coles.com.au/a/glenorchy/specials/search/half-price-specials',
  postcode: '7000'
}, {
  id: 'act',
  url: 'https://shop.coles.com.au/a/queabeyan/specials/search/half-price-specials',
  postcode: '2601'
}, {
  id: 'nt',
  url: 'https://shop.coles.com.au/a/casuarina/specials/search/half-price-specials',
  postcode: '0800'
}];
exports.colesLocations = colesLocations;