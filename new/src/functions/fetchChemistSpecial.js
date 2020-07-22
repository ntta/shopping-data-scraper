import axios from 'axios';
import fs from 'fs';
import {
  chemistWarehouseProductsPath,
  chemistWarehouseCategoriesPath,
  categoryList,
  categoryApi,
} from '../variables/chemistVariables';

let PRODUCTS = [];
let CATEGORIES = [];

const fetchNumberOfPages = async (subCategory) => {
  let response = await axios.get(
    `${categoryApi}category=${subCategory.categoryNumber}`
  );
  let totalItems =
    response.data.universes.universe[0].breadcrumbs['nr-of-items-in-selection'];
  return Math.ceil(totalItems / 48);
};

const getCategoryId = (str) => {
  return (
    'cw-' +
    str
      .toLowerCase()
      .trim()
      .replace('&', '')
      .replace(',', '')
      .replace('(', '')
      .replace(')', '')
      .split(' ')
      .filter((c) => c !== '')
      .join('-')
  );
};

const addToCategories = (category) => {
  if (category !== null) {
    let foundIndex = CATEGORIES.findIndex(
      (c) => c.id === getCategoryId(category.categoryName)
    );
    if (foundIndex < 0) {
      CATEGORIES.push({
        id: getCategoryId(category.categoryName),
        name: category.categoryName,
      });
    }
  }
};

const fetchProductsEachPage = async (currentIndex, category, subCategory) => {
  let pageApi = `${categoryApi}category=${
    subCategory === null ? category.categoryNumber : subCategory.categoryNumber
  }&index=${currentIndex}`;
  console.log(pageApi);
  let pageResponse = await axios.get(pageApi);
  let items =
    pageResponse.data.universes.universe[0]['items-section'].items.item;
  addToCategories(category);
  addToCategories(subCategory);
  for (let item of items) {
    let id = `cw-${item.id}`;
    let foundIndex = PRODUCTS.findIndex((p) => p.id === id);
    let categoryId =
      subCategory === null
        ? getCategoryId(category.categoryName)
        : `${getCategoryId(category.categoryName)}/${getCategoryId(
            subCategory.categoryName
          )}`;
    if (foundIndex > -1) {
      if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
        PRODUCTS[foundIndex].categoryIds.push(categoryId);
      }
      continue;
    }
    let categoryIds = [categoryId];
    let name = '';
    let brand = '';
    let promo = '';
    let imageUrls = [];
    let price = 0;
    let orgPrice = 0;
    for (let attr of item.attribute) {
      let value = attr.value[0].value;
      switch (attr.name) {
        case 'name':
          name = value;
          break;
        case 'brand':
          brand = value;
          break;
        case '_thumburl':
          imageUrls = [getImageUrl(value)];
          break;
        case 'price_cw_au':
          price = Number(value);
          break;
        case 'rrp_cw_au':
          orgPrice = Number(value);
          break;
        case 'splat':
          promo = value;
          break;
      }
    }
    let discountRate = getDiscountRate(price, orgPrice);
    promo = getPromoText(promo);
    let locations = {
      ALL: {
        price,
        discountRate,
        promo,
        orgPrice,
      },
    };
    if (price === orgPrice && discountRate === 0) continue;
    PRODUCTS.push({
      id,
      name,
      brand,
      imageUrls,
      storeId: 'chemist-warehouse',
      packageSize: '',
      cupPrice: '',
      categoryIds,
      locations,
      similarProducts: [],
    });
  }
};

const getDiscountRate = (price, orgPrice) => {
  return Math.round(100 - (price / orgPrice) * 100);
};

const getPromoText = (str) => {
  return str.includes('online_only') ? 'Online Only' : '';
};

const fetchChemistSpecial = async () => {
  for (let category of categoryList) {
    console.log(`Fetching products in category ${category.categoryName}`);
    if (category.subCategories.length === 0) {
      let numberOfPages = await fetchNumberOfPages(category);
      for (let i = 0; i < numberOfPages; i++) {
        await fetchProductsEachPage(i * 48, category, null);
      }
      continue;
    }
    for (let subCategory of category.subCategories) {
      let numberOfPages = await fetchNumberOfPages(subCategory);
      for (let i = 0; i < numberOfPages; i++) {
        await fetchProductsEachPage(i * 48, category, subCategory);
      }
    }
  }
  let filteringCategories = [...CATEGORIES];
  for (let category of filteringCategories) {
    let found = false;
    for (let product of PRODUCTS) {
      for (let categoryId of product.categoryIds) {
        if (categoryId.includes(category.id)) {
          found = true;
        }
      }
    }
    if (!found) {
      CATEGORIES = CATEGORIES.filter((c) => c.id !== category.id);
    }
  }
  fs.writeFileSync(chemistWarehouseProductsPath, JSON.stringify(PRODUCTS));
  fs.writeFileSync(chemistWarehouseCategoriesPath, JSON.stringify(CATEGORIES));
};

const getImageUrl = (url) => {
  return url.includes('_200') ? url.replace('_200', '_800') : url;
};

export default fetchChemistSpecial;
