"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colesLocations = exports.categoryBlacklist = exports.colesUrl = void 0;
var colesUrl = 'https://shop.coles.com.au';
exports.colesUrl = colesUrl;
var categoryBlacklist = ['Liquor', 'Tobacco'];
exports.categoryBlacklist = categoryBlacklist;
var colesLocations = [{
  id: 'VIC',
  url: 'https://shop.coles.com.au/a/richmond-south/specials/browse',
  postcode: '3000'
}, {
  id: 'SA',
  url: 'https://shop.coles.com.au/a/churchill-centre/specials/browse',
  postcode: '5000'
}, {
  id: 'QLD',
  url: 'https://shop.coles.com.au/a/fairfield/specials/browse',
  postcode: '4000'
}, {
  id: 'NSW',
  url: 'https://shop.coles.com.au/a/alexandria/specials/browse',
  postcode: '2000'
}, {
  id: 'WA',
  url: 'https://shop.coles.com.au/a/dianella/specials/browse',
  postcode: '6000'
}, {
  id: 'TAS',
  url: 'https://shop.coles.com.au/a/glenorchy/specials/browse',
  postcode: '7000'
}, {
  id: 'ACT',
  url: 'https://shop.coles.com.au/a/queabeyan/specials/browse',
  postcode: '2601'
}, {
  id: 'NT',
  url: 'https://shop.coles.com.au/a/casuarina/specials/browse',
  postcode: '0800'
}];
exports.colesLocations = colesLocations;