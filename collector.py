import os, json

WOOLWORTHS_PATH = './stores/woolworths/products.json'
COLES_PATH = './stores/coles/products.json'
DATA_PATH = './data/all-products.json'
SAFE_LIST = ['pantry', 'meat-seafood-deli', 'freezer', 'dairy-eggs-fridge', 'bakery', 'drinks', 'international-foods', 'health-beauty']

if __name__ == '__main__':
    # Collect all products from Coles and Woolworths
    coles = []
    woolworths = []
    if os.path.exists(COLES_PATH):
        with open(COLES_PATH, 'r', encoding='utf-8') as colesFile:
            coles = coles + list(json.load(colesFile))

    if os.path.exists(WOOLWORTHS_PATH):
        with open(WOOLWORTHS_PATH, 'r', encoding='utf-8') as woolworthsFile:
            woolworths = woolworths + list(json.load(woolworthsFile))

    # Filter duplicate IDs and merge category ID
    products = coles + woolworths
    for i in range(0, len(products)):
        if products[i]['id'] == '######':
            continue
        for j in range(i+1, len(products)):
            if products[j]['id'] == '######':
                continue
            if products[i]['id'] == products[j]['id']:
                if products[i]['categoryIds'][0] in SAFE_LIST and products[j]['categoryIds'][0] == 'household':
                    products[j]['id'] = '######'
                elif products[i]['categoryIds'][0] == 'household' and products[j]['categoryIds'][0] in SAFE_LIST:
                    products[i]['id'] = '######'
                else:
                    products[i]['categoryIds'] = list(set(products[i]['categoryIds'] + products[j]['categoryIds']))
                    products[j]['id'] = '######'

    lenProducts = len(products)
    i = 0
    while i < lenProducts:
        if products[i]['id'] == '######':
            products.pop(i)
            lenProducts = len(products)
        else:
            i = i + 1

    with open(DATA_PATH, 'w', encoding='utf-8') as dataFile:
        json.dump(products, dataFile)
    print(f'Total {len(products)} products')
