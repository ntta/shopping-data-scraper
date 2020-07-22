import fs from 'fs';

const coles = JSON.parse(fs.readFileSync('./data/coles.json'));
const woolworths = JSON.parse(fs.readFileSync('./data/woolworths.json'));
const chemistWarehouse = JSON.parse(
  fs.readFileSync('./data/chemist-warehouse.json')
);

const createAppDataFile = (uploadDate, fromDate, toDate) => {
  let appData = {
    'store-version': {
      coles: {
        name: 'Coles',
        isAvailable: true,
        uploadDate,
        fromDate,
        toDate,
      },
      woolworths: {
        name: 'Woolworths',
        isAvailable: true,
        uploadDate,
        fromDate,
        toDate,
      },
      'chemist-warehouse': {
        name: 'Chemist Warehouse',
        isAvailable: true,
        uploadDate,
        fromDate,
        toDate,
      },
    },
    'store-data': {
      coles,
      woolworths,
      'chemist-warehouse': chemistWarehouse,
    },
  };
  fs.writeFileSync(`./data/app-data.json`, JSON.stringify(appData));
};

export default createAppDataFile;
