# Shopping Data Scraper

*Folder `rev` contains refactored code for the project, all will be converted to TypeScript and NodeJS* 

Get product data from Woolworths and Coles and generate a single json file for Firebase.
Coles is using NodeJS.
Woolworths is using Python.

At the end of the day, Python is used to collect all data and to filter duplicates.

## Category List
All products must have category ID in the table below
|       id          |        name        |
|-------------------|--------------------|
|meat-seafood-deli  |Meat, Seafood & Deli|
|bakery             |Bakery              |
|dairy-eggs-fridge  |Dairy, Eggs & Fridge|
|pantry             |Pantry              |
|freezer            |Freezer             |
|drinks             |Drinks              |
|pet                |Pet                 |
|baby               |Baby                |
|health-beauty      |Health & Beauty     |
|household          |Household           |
|international-foods|International Foods |
|uncategorised      |Uncategorised       |

## Product Element
A product should have elements below:
```
{
  id: 'c2994130p-9327693006937',
  store: 'coles',
  name: 'Natural Balance Conditioner',
  price: 9,
  oldPrice: 18,
  categoryId: 'health-beauty',
  imagePath: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/2/9/9/2994130.jpg',
  cupPrice: '$1.80 per 100ml',
  unit: 'ea',
  packageSize: '500ml',
  barcode: [ '9327693006937' ],
  brand: 'Sukin'
}
```
* `id` is a combination of store, store stock ID and first barcode


## Woolworths
* Get data from Woolworths API
* Only Python with requests

## Coles
* Scrape data from https://shop.coles.com.au/a/richmond-south/specials/search/half-price-specials
* Required Puppeteer
* Need to manually copy cookie from actual web browser to cookie.txt
