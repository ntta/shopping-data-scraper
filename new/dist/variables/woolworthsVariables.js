"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoryWhitelist = exports.productsApi = exports.categoriesApi = void 0;
var categoriesApi = 'https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials/';
exports.categoriesApi = categoriesApi;
var productsApi = 'https://www.woolworths.com.au/apis/ui/browse/category';
exports.productsApi = productsApi;
var categoryWhitelist = [{
  id: 'fruit-veg',
  specialId: 'fruit-veg-specials'
}, {
  id: 'meat-seafood-deli',
  specialId: 'meat-seafood-deli-specials'
}, {
  id: 'bakery',
  specialId: 'bakery-specials'
}, {
  id: 'dairy-eggs-fridge',
  specialId: 'dairy-eggs-fridge-specials'
}, {
  id: 'pantry',
  specialId: 'pantry-specials'
}, {
  id: 'freezer',
  specialId: 'freezer-specials'
}, {
  id: 'drinks',
  specialId: 'drinks-specials'
}, {
  id: 'pet',
  specialId: 'pet-specials'
}, {
  id: 'baby',
  specialId: 'baby-specials'
}, {
  id: 'health-beauty',
  specialId: 'health-beauty-specials'
}, {
  id: 'household',
  specialId: 'household-specials'
}, {
  id: 'lunch-box',
  specialId: 'lunch-box-specials'
}];
exports.categoryWhitelist = categoryWhitelist;