import inquirer from 'inquirer';
import fs from 'fs';
import fetchHalfPriceColes from './actions/half-price/fetchHalfPriceColes';
import fillCategoryIds from './actions/half-price/fillCategoryIds';

const EXIT = 'exit';
const GET_HALF_PRICES = 'get_half_prices';
const FILL_CATEGORY_IDS = 'fill_category_ids';

const choices = [
  { title: 'Get half-price products', action: GET_HALF_PRICES },
  { title: 'Fill category IDs', action: FILL_CATEGORY_IDS },
  { title: 'Exit', action: EXIT },
];

const stores = [
  { name: 'Coles', id: 'coles' },
  { name: 'Woolworths', id: 'woolworths' },
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
      case GET_HALF_PRICES:
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
                await fetchHalfPriceColes();
                return;
              case 'woolworths':
                return;
            }
          });
        return;
      case FILL_CATEGORY_IDS:
        const data = fs.readFileSync(
          './data/products/half-price-coles.json',
          'utf8'
        );
        fillCategoryIds(JSON.parse(data));
        return;
      case EXIT:
        return;
    }
  });
