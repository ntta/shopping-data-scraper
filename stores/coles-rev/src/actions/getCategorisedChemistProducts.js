import axios from 'axios';
import fs from 'fs';
/* Product object format:
 * {
 *  id: string,
 *  brand: string,
 *  name: string,
 *  imageUrl: string,
 *  categories: Array of string,
 *  subCategories: Array of string,
 *  locations: ['vic', 'sa','nsw','qld','act','nt','wa','qld']
 *
 * }
 */

const api =
  'https://www.chemistwarehouse.com.au/searchapi/webapi/search/category?'; //category=542&index=0&sort='

const getCategorisedChemistProducts = async (categories) => {
  try {
    let products = [];
    for (let category of categories) {
      console.log(`Fetching products in category ${category.categoryName}`);
      for (let subCategory of category.subCategories) {
        let fetchingApi = `${api}category=${subCategory.categoryNumber}`;
        let response = await axios.get(fetchingApi);
        let totalItems =
          response.data.universes.universe[0].breadcrumbs[
            'nr-of-items-in-selection'
          ];
        let numberOfPages = Math.ceil(totalItems / 48);
        for (let i = 0; i < numberOfPages; i++) {
          let currentIndex = i * 48;
          let pageApi = `${api}category=${subCategory.categoryNumber}&index=${currentIndex}`;
          console.log(pageApi);
          let pageResponse = await axios.get(pageApi);
          let items =
            pageResponse.data.universes.universe[0]['items-section'].items.item;
          for (let item of items) {
            let id = item.id;
            if (products.some((p) => p.id === id)) {
              products.map((p) => {
                if (p.id === id) {
                  console.log(p);
                  if (p.categories[category.categoryId]) {
                    p.categories[category.categoryId].push(
                      subCategory.subCategoryId
                    );
                  } else {
                    p.categories[category.categoryId] = [
                      subCategory.subCategoryId,
                    ];
                  }
                  p.categories[category.categoryId] = [
                    ...new Set(p.categories[category.categoryId]),
                  ];
                }
              });
              continue;
            }
            let itemCategories = {};
            itemCategories[category.categoryId] = [subCategory.subCategoryId];
            let name = '';
            let brand = '';
            let imageUrl = '';
            let price = '';
            let orgPrice = '';
            let locations = [
              'vic',
              'sa',
              'nsw',
              'qld',
              'act',
              'nt',
              'wa',
              'qld',
            ];
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
                  imageUrl = getImageUrl(value);
                  break;
                case 'price_cw_au':
                  price = value;
                  break;
                case 'rrp_cw_au':
                  orgPrice = value;
                  break;
              }
            }
            products.push({
              id,
              name,
              brand,
              imageUrl,
              price,
              orgPrice,
              categories: itemCategories,
              locations,
            });
          }
        }
      }
    }
    fs.writeFileSync(
      `./data/products/chemist/products.json`,
      JSON.stringify(products)
    );
  } catch (err) {
    console.log(err);
    return;
  }
};

const getImageUrl = (url) => {
  return url.includes('_200') ? url.replace('_200', '_800') : url;
};

export default getCategorisedChemistProducts;
