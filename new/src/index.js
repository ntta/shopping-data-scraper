import inquirer from 'inquirer';
import fetchColesSpecial from './functions/fetchColesSpecial';
import fetchWoolworthsSpecial from './functions/fetchWoolworthsSpecial';
import findSimilarProducts from './functions/findSimilarProducts';
import fetchChemistSpecial from './functions/fetchChemistSpecial';
import createAppDataFile from './functions/createAppDataFile';
import uploadToFirestore from './functions/uploadToFirestore';
import getHalfPriceProducts from './functions/getHalfPriceProducts';
import getHalfPriceCategories from './functions/getHalfPriceCategories';
import createStoreDataFile from './functions/createStoreDataFile';

const EXIT = 'exit';
const GET_SPECIAL_PRODUCTS = 'get_special_prices';
const FIND_SIMILAR_PRODUCTS = 'find_similar_products';
const GET_HALF_PRICE_PRODUCTS = 'get_half_price_products';
const GET_HALF_PRICE_CATEGORIES = 'get_half_price_categories';
const UPLOAD_TO_FIRESTORE = 'upload_to_firestore';
const CREATE_APP_DATA_FILE = 'create_app_data_file';
const CREATE_STORE_DATA_FILE = 'create_store_data_file';

const choices = [
  { title: 'Get special products', action: GET_SPECIAL_PRODUCTS },
  { title: 'Find similar products', action: FIND_SIMILAR_PRODUCTS },
  { title: 'Get half price products', action: GET_HALF_PRICE_PRODUCTS },
  { title: 'Get half price categories', action: GET_HALF_PRICE_CATEGORIES },
  { title: 'Create app data file', action: CREATE_APP_DATA_FILE },
  { title: 'Create store data file', action: CREATE_STORE_DATA_FILE },
  { title: 'Exit', action: EXIT },
];

const stores = [
  { name: 'Coles', id: 'coles' },
  { name: 'Woolworths', id: 'woolworths' },
  { name: 'Chemist Warehouse', id: 'chemist' },
];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Actions: ',
      choices: Object.values(choices).map((c) => {
        return c.title;
      }),
      filter: (val) => {
        return choices.filter((c) => {
          if (c.title === val) {
            return c.action;
          }
        })[0].action;
      },
    },
  ])
  .then(async (answers) => {
    switch (answers.action) {
      case GET_SPECIAL_PRODUCTS:
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'store',
              message: 'Store: ',
              choices: Object.values(stores).map((s) => {
                return s.name;
              }),
              filter: (val) => {
                return stores.filter((s) => {
                  if (s.name === val) {
                    return s.id;
                  }
                })[0].id;
              },
            },
          ])
          .then(async (subAnswers) => {
            switch (subAnswers.store) {
              case 'coles':
                await fetchColesSpecial();
                return;
              case 'woolworths':
                console.log('Fetching Woolworths');
                await fetchWoolworthsSpecial();
                return;
              case 'chemist':
                console.log('Fetching Chemist Warehouse');
                await fetchChemistSpecial();
                return;
            }
          });
        return;
      case FIND_SIMILAR_PRODUCTS:
        findSimilarProducts();
        return;
      case CREATE_STORE_DATA_FILE:
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'store',
              message: 'Store ID: ',
            },
          ])
          .then((subAnswers) => {
            createStoreDataFile(subAnswers.store);
          });
        return;
      case CREATE_APP_DATA_FILE:
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'uploadDate',
              message: 'Upload date (dd/MM/yyyy): ',
            },
            {
              type: 'input',
              name: 'fromDate',
              message: 'From date (dd/MM/yyyy): ',
            },
            {
              type: 'input',
              name: 'toDate',
              message: 'To date (dd/MM/yyyy): ',
            },
          ])
          .then((subAnswers) => {
            createAppDataFile(
              subAnswers.uploadDate,
              subAnswers.fromDate,
              subAnswers.toDate
            );
          });
        return;
      case UPLOAD_TO_FIRESTORE:
        await uploadToFirestore();
        return;
      case GET_HALF_PRICE_PRODUCTS:
        getHalfPriceProducts();
        return;
      case GET_HALF_PRICE_CATEGORIES:
        getHalfPriceCategories();
        return;
      case EXIT:
        return;
    }
  });
