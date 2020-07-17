import inquirer from 'inquirer';
import fetchColesSpecial from './functions/fetchColesSpecial';

const EXIT = 'exit';
const GET_SPECIAL_PRODUCTS = 'get_special_prices';

const choices = [
  { title: 'Get special products', action: GET_SPECIAL_PRODUCTS },
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
                inquirer
                  .prompt([
                    {
                      type: 'input',
                      name: 'location',
                      message: 'Enter Location: ',
                      default: 'VIC',
                    },
                  ])
                  .then(async (subSubAnswers) => {
                    await fetchColesSpecial(subSubAnswers.location);
                  });
                // fetchColesSpecial('VIC'),
                // fetchColesSpecial('NSW'),
                // fetchColesSpecial('QLD'),
                // fetchColesSpecial('TAS'),
                // fetchColesSpecial('WA'),
                // fetchColesSpecial('SA'),
                // fetchColesSpecial('ACT'),
                // fetchColesSpecial('NT'),
                return;
              case 'woolworths':
                console.log('Fetching Woolworths');
                return;
              case 'chemist':
                console.log('Fetching Chemist Warehouse');
                return;
            }
          });
        return;
      case EXIT:
        return;
    }
  });
