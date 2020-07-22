import fs from 'fs';

const getHalfPriceCategories = () => {
  const storeIds = ['coles', 'woolworths', 'chemist-warehouse'];
  for (let storeId of storeIds) {
    getFromStore(storeId);
  }
};

const getFromStore = (storeId) => {
  const products = JSON.parse(
    fs.readFileSync(
      `./data/products/half-price/${storeId}-half-price-products.json`
    )
  );
  const categories = JSON.parse(
    fs.readFileSync(`./data/products/${storeId}-special-categories.json`)
  );
  let newCategories = [];
  for (let product of products) {
    for (let prodCate of product.categoryIds) {
      const parts = prodCate.split('/');
      let foundIndex = newCategories.findIndex((c) => c.id === parts[0]);
      if (foundIndex < 0) {
        if (parts.length === 1) {
          newCategories.push({
            id: parts[0],
            name: categories.find((c) => c.id === parts[0]).name,
          });
        }

        if (parts.length === 2) {
          newCategories.push({
            id: parts[0],
            name: categories.find((c) => c.id === parts[0]).name,
            subCategories: [
              {
                id: parts[1],
                name: categories.find((c) => c.id === parts[1]).name,
              },
            ],
          });
        }
      } else {
        if (parts.length === 2) {
          let foundSubIndex = newCategories[foundIndex].subCategories.findIndex(
            (c) => c.id === parts[1]
          );
          if (foundSubIndex < 0) {
            newCategories[foundIndex].subCategories.push({
              id: parts[1],
              name: categories.find((c) => c.id === parts[1]).name,
            });
          }
        }
      }
    }
  }

  fs.writeFileSync(
    `./data/products/half-price/${storeId}-half-price-categories.json`,
    JSON.stringify(newCategories)
  );
};

export default getHalfPriceCategories;
