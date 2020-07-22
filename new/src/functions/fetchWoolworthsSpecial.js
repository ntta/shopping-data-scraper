import axios from 'axios';
import fs from 'fs';
import {
  categoriesApi,
  categoryWhitelist,
  productsApi,
} from '../variables/woolworthsVariables';

let CATEGORIES = [];
let PARAMS = {};
let PRODUCTS = [];
const PAGESIZE = 36;

const fetchWoolworthsSpecial = async () => {
  await fetchCategoriesAndParams();
  await fetchProducts();
  console.log(`TOTAL ${PRODUCTS.length} PRODUCTS!`);
  fs.writeFileSync(
    `./data/products/woolworths-special-products.json`,
    JSON.stringify(PRODUCTS)
  );
  fs.writeFileSync(
    `./data/products/woolworths-special-categories.json`,
    JSON.stringify(CATEGORIES)
  );
};

const fetchProducts = async () => {
  const categoryIds = Object.keys(PARAMS);
  for (let categoryId of categoryIds) {
    await fetchProductsOfCategory(categoryId);
  }
};

const fetchProductsOfCategory = async (categoryId) => {
  const response = await axios.get(productsApi, { params: PARAMS[categoryId] });
  const totalProducts = response.data.TotalRecordCount;
  const totalPages = Math.ceil(totalProducts / PAGESIZE);
  if (totalPages > 0) {
    for (let i = 1; i <= totalPages; i++) {
      await fetchProductsOfPage(categoryId, i);
    }
  } else {
    CATEGORIES = CATEGORIES.filter((c) => c.id !== categoryId);
  }
};

const fetchProductsOfPage = async (categoryId, pageNumber) => {
  const params = { ...PARAMS[categoryId], pageNumber };
  const response = await axios.get(productsApi, { params });
  const fetchedProducts = response.data.Bundles;
  for (let fetchedProduct of fetchedProducts) {
    let data = fetchedProduct.Products[0];
    if (!data.InstoreIsOnSpecial) continue;
    let id = `w-${data.UrlFriendlyName}`;
    if (typeof data.Stockcode === 'number') {
      if (typeof data.Barcode === 'string') {
        id = `w-${data.Stockcode}-${data.Barcode}`;
      } else {
        id = `w-${data.Stockcode}`;
      }
    }
    let name = data.Name ? data.Name.trim() : '';
    let brand = data.Brand ? getBrand(data.Brand.trim()) : 'Woolworths';
    let imageUrls = [data.DetailsImagePaths[0]];
    let storeId = 'woolworths';
    let packageSize = data.PackageSize ? data.PackageSize.trim() : null;
    let cupPrice = data.InstoreCupString ? data.InstoreCupString.trim() : null;
    let localPrice = {
      price: data.InstorePrice,
      discountRate: getDiscountRate(data),
      promo: getPromoText(data),
      orgPrice: data.InstoreWasPrice,
    };
    let locations = {
      ALL: localPrice,
      // NSW: localPrice,
      // QLD: localPrice,
      // TAS: localPrice,
      // WA: localPrice,
      // SA: localPrice,
      // NT: localPrice,
      // ACT: localPrice,
    };
    let categoryIds = [categoryId];
    let newProduct = {
      id,
      name,
      brand,
      imageUrls,
      storeId,
      packageSize,
      cupPrice,
      locations,
      categoryIds,
      similarProducts: [],
    };
    const foundIndex = PRODUCTS.findIndex((p) => p.id === id);
    if (foundIndex > -1) {
      if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
        PRODUCTS[foundIndex].categoryIds.push(categoryId);
      }
      console.log(PRODUCTS[foundIndex]);
    } else {
      console.log(newProduct);
      PRODUCTS.push(newProduct);
    }
  }
};

const getBrand = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

const getDiscountRate = (data) => {
  let rate1 = 0;
  let rate2 = 0;
  if (data.InstorePrice === data.InstoreWasPrice) {
    const promoText = getPromoText(data).replace('$', '');
    const parts = promoText.split(' ');
    const quantity = Number(parts[0]);
    const amount = Number(parts[parts.length - 1]);
    const one = amount / quantity;
    rate1 = Math.round(100 - (one / data.InstorePrice) * 100);
  } else {
    rate2 = Math.round(100 - (data.InstorePrice / data.InstoreWasPrice) * 100);
  }
  return rate1 >= rate2 ? rate1 : rate2;
};

const getPromoText = (data) => {
  const tagContent = data.CentreTag.TagContent;
  if (tagContent && typeof tagContent === 'string') {
    const parts = tagContent.split('>');
    for (let part of parts) {
      if (part.includes('for $')) {
        return part.substr(0, part.indexOf('<')).trim();
      }
    }
  }
  return '';
};

const fetchCategoriesAndParams = async () => {
  const response = await axios.get(categoriesApi);
  const responseData = response.data.Categories;
  let whitelistIds = [];
  let whitelistSpecialIds = [];
  categoryWhitelist.map((c) => {
    whitelistIds.push(c.id);
    whitelistSpecialIds.push(c.specialId);
  });
  for (let category of responseData) {
    if (whitelistIds.includes(category.UrlFriendlyName)) {
      let categoryId = `w-${category.UrlFriendlyName}`;
      CATEGORIES.push({
        id: categoryId,
        name: category.Description,
      });
      for (let special of category.Children) {
        if (whitelistSpecialIds.includes(special.UrlFriendlyName)) {
          let location = `/shop/browse/${category.UrlFriendlyName}/${special.UrlFriendlyName}`;
          PARAMS[categoryId] = {
            categoryId: special.NodeId,
            filters: null,
            formatObject: `{"name": "${special.Description}"}`,
            isBundle: false,
            isMobile: false,
            isSpecial: true,
            location,
            pageNumber: 1,
            pageSize: PAGESIZE,
            sortType: 'Name',
            url: location,
          };
          break;
        }
      }
    }
  }
};

export default fetchWoolworthsSpecial;
