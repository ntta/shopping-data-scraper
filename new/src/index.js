import inquirer from 'inquirer';
import fetchColesSpecial from './functions/fetchColesSpecial';
import fetchWoolworthsSpecial from './functions/fetchWoolworthsSpecial';
import findSimilarProducts from './functions/findSimilarProducts';
import fetchChemistSpecial from './functions/fetchChemistSpecial';
import createAppDataFile from './functions/createAppDataFile';

const EXIT = 'exit';
const GET_SPECIAL_PRODUCTS = 'get_special_prices';
const FIND_SIMILAR_PRODUCTS = 'find_similar_products';
const CREATE_APP_DATA_FILE = 'create_app_data_file';

const choices = [
  { title: 'Get special products', action: GET_SPECIAL_PRODUCTS },
  { title: 'Find similar products', action: FIND_SIMILAR_PRODUCTS },
  { title: 'Create app data file', action: CREATE_APP_DATA_FILE },
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
      case CREATE_APP_DATA_FILE:
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'store',
              message: 'Store ID: ',
            },
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
              subAnswers.store,
              subAnswers.uploadDate,
              subAnswers.fromDate,
              subAnswers.toDate
            );
          });
        return;
      case EXIT:
        return;
    }
  });
