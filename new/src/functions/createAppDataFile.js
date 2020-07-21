import fs from 'fs';
import {
  colesProductsPath,
  colesCategoriesPath,
} from '../variables/colesVariables';
import {
  woolworthsProductsPath,
  woolworthsCategoriesPath,
} from '../variables/woolworthsVariables';
import {
  chemistWarehouseProductsPath,
  chemistWarehouseCategoriesPath,
} from '../variables/chemistVariables';

const createAppDataFile = (store, uploadDate, fromDate, toDate) => {
  let appData = {
    version: {
      'upload-date': uploadDate,
      'from-date': fromDate,
      'to-date': toDate,
    },
  };
  let filename = '';
  switch (store) {
    case 'coles':
      appData = {
        coles: {
          ...appData,
          products: JSON.parse(fs.readFileSync(colesProductsPath)),
          categories: JSON.parse(fs.readFileSync(colesCategoriesPath)),
        },
      };
      filename = 'coles.json';
      break;
    case 'woolworths':
      appData = {
        woolworths: {
          ...appData,
          products: JSON.parse(fs.readFileSync(woolworthsProductsPath)),
          categories: JSON.parse(fs.readFileSync(woolworthsCategoriesPath)),
        },
      };
      filename = 'woolworths.json';
      break;
    case 'chemist-warehouse':
      appData = {
        'chemist-warehouse': {
          ...appData,
          products: JSON.parse(fs.readFileSync(chemistWarehouseProductsPath)),
          categories: JSON.parse(
            fs.readFileSync(chemistWarehouseCategoriesPath)
          ),
        },
      };
      filename = 'chemist-warehouse.json';
      break;
  }
  fs.writeFileSync(`./data/${filename}`, JSON.stringify(appData));
};

export default createAppDataFile;
