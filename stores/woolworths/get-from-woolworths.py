import json, requests, sys, datetime
import os

PARAM_API = 'https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials/'
PRODUCT_API = 'https://www.woolworths.com.au/apis/ui/browse/category'

def printWithTime(text):
    now = datetime.datetime.now()
    now = '[' + now.strftime('%d-%m %H:%M:%S') + ']'
    print(f'{now} {text}')

def generateCategoryParams(dataParams):
    categoryParams = {}
    for category in dataParams['Categories']:
        if category['NodeId'] == 'specialsgroup':
            for children in category['Children']:
                if children['UrlFriendlyName'] == 'half-price':
                    for subChildren in children['Children']:
                        categoryParamId = subChildren['UrlFriendlyName']
                        formatObject = "{'name': '" + subChildren['Description'] + "'}"
                        location = "/shop/browse/specials/half-price/" + subChildren['UrlFriendlyName']
                        categoryParam = {
                            "categoryId": subChildren['NodeId'],
                            "filters": None,
                            "formatObject": formatObject,
                            "isBundle": False,
                            "isMobile": False,
                            "isSpecial": True,
                            "location": location,
                            "pageNumber": 1,
                            "pageSize": 999,
                            "sortType": 'Name',
                            "url": location
                        }
                        categoryParams[categoryParamId] = categoryParam
                    return categoryParams
    return False

def getCategoryList(params):
    paramIds = list(params.keys())
    categories = {}
    for i in paramIds:
        if i == 'lunch-box':
            continue
        formatObject = params[i]['formatObject']
        categoryName = formatObject.replace("{'name': ", "").replace("'", "").replace("}", "")
        categories[i] = {
            'name': categoryName
        }
    return categories

def generateProductId(item):
    stockcode = str(item['Stockcode']).replace(' ', '')
    barcode = str(item['Barcode']).replace(' ', '')
    return f'w{stockcode}-{barcode}'

def generateProductDetails(item, category, productId):
    if not isinstance(item['Barcode'], list):
        barcode = [item['Barcode']]
    if item['InstoreHasCupPrice']:
        cupPrice = item['InstoreCupString'].lower()
    else:
        cupPrice = None
    return {
        'id': productId,
        'store': 'woolworths',
        'name': item['Name'],
        'brand': toCapitalized(item['Brand']),
        'price': item['InstorePrice'],
        'orgPrice': item['InstoreWasPrice'],
        'categoryId': 'household' if category == 'lunch-box' else category, # lunch-box will be merged with household
        'imagePath': item['DetailsImagePaths'][0],
        'cupPrice': cupPrice,
        'unit': item['Unit'].lower(),
        'packageSize': item['PackageSize'].lower(),
        'barcode': barcode,
        'isAvailable': True
    }

def toCapitalized(text):
    words = text.split()
    result = []
    for word in words:
        result.append(word.replace(' ', '').capitalize())
    return ' '.join(result)

if __name__ == '__main__':
    printWithTime('Scrapping data from Woolworths...')

    # Generate params from PARAM_API
    # Each param corresponds to one category
    response = requests.get(PARAM_API)
    if response.status_code == 200:
        dataParams = response.json()
        printWithTime('Generating category params...')
    else:
        printWithTime('Cannot connect to server')
        sys.exit()

    categoryParams = generateCategoryParams(dataParams)
    categoryParamIds = list(categoryParams.keys())
    printWithTime('Params have been generated.')
    # Categories with id
    categories = getCategoryList(categoryParams)
    if not os.path.exists('categories.json'):
        with open('categories.json', 'w', encoding='utf-8') as categoryFile:
            json.dump(categories, categoryFile)

    # Use generated params to get products
    products = []
    count = 0
    for i in categoryParamIds:
        printWithTime(f'Getting products of {i}...')
        response = requests.get(PRODUCT_API, params=categoryParams[i])
        if response.status_code != 200:
            printWithTime(f'Cannot get products of {i}')
            continue
        dataProducts = response.json()
        if len(dataProducts['Bundles']) > 0:
            for item in dataProducts['Bundles']:
                instoreIsAvailable = item['Products'][0]['InstoreIsAvailable']
                instorePrice = item['Products'][0]['InstorePrice']
                if instoreIsAvailable and instorePrice > 0:
                    products.append(generateProductDetails(item['Products'][0], i, generateProductId(item['Products'][0])))
                    count = count + 1
    printWithTime('Done getting data. Writing to file...')
    with open('./data/woolworths-products.json','w', encoding='utf-8') as productFile:
        json.dump(products, productFile)
    printWithTime(f'ALL DONE. TOTAL {count} PRODUCTS!')
