# Shopping Data Scraper

Get product data from Woolworths and Coles and generate a single json file for Firebase.

## Category List
All products must have category ID in the table below
|       id        |        name        |
|-----------------|--------------------|
|meat-seafood-deli|Meat, Seafood & Deli|
|bakery           |Bakery              |
|dairy-eggs-fridge|Dairy, Eggs & Fridge|
|pantry           |Pantry              |
|freezer          |Freezer             |
|drinks           |Drinks              |
|pet              |Pet                 |
|baby             |Baby                |
|health-beauty    |Health & Beauty     |
|household        |Household           |

## Woolworths
* Get data from Woolworths API
* Only Python with requests

## Coles
### NodeJS
* *Required Puppeteer to generate HTML files
* Need to manually copy cookie from actual web browser to cookie.txt
### Python
* Required BeautifulSoup to extract data from HTML files
