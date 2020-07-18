import inquirer from 'inquirer';
import fetchColesSpecial from './functions/fetchColesSpecial';
import fetchWoolworthsSpecial from './functions/fetchWoolworthsSpecial';
import findSimilarProducts from './functions/findSimilarProducts';

const EXIT = 'exit';
const GET_SPECIAL_PRODUCTS = 'get_special_prices';
const FIND_SIMILAR_PRODUCTS = 'find_similar_products';

const choices = [
  { title: 'Get special products', action: GET_SPECIAL_PRODUCTS },
  { title: 'Find similar products', action: FIND_SIMILAR_PRODUCTS },
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
                // inquirer
                //   .prompt([
                //     {
                //       type: 'input',
                //       name: 'location',
                //       message: 'Enter Location: ',
                //       default: 'VIC',
                //     },
                //   ])
                //   .then(async (subSubAnswers) => {
                //     await fetchColesSpecial(subSubAnswers.location);
                //   });
                return;
              case 'woolworths':
                console.log('Fetching Woolworths');
                await fetchWoolworthsSpecial();
                return;
              case 'chemist':
                console.log('Fetching Chemist Warehouse');
                return;
            }
          });
        return;
      case FIND_SIMILAR_PRODUCTS:
        findSimilarProducts();
        return;
      case EXIT:
        return;
    }
  });
